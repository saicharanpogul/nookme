import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { registerForPushNotifications } from '@/lib/notifications';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        initialized: true,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });
      });
    } catch {
      set({ initialized: true });
    }
  },

  signUp: async (email, password, displayName, username) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            username,
          },
        },
      });

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      // Create profile in profiles table
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          display_name: displayName,
          username,
          avatar_color: '#007AFF',
        });

        // Seed sample data so new users can explore the app
        await supabase.rpc('seed_user_data', { target_user_id: data.user.id });
      }

      set({ loading: false });
      return { error: null };
    } catch (err: any) {
      set({ loading: false });
      return { error: err.message || 'Something went wrong' };
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      set({ loading: false });
      if (error) return { error: error.message };

      // Register for push notifications
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        registerForPushNotifications(user.id).catch(() => { });
      }

      return { error: null };
    } catch (err: any) {
      set({ loading: false });
      return { error: err.message || 'Something went wrong' };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
