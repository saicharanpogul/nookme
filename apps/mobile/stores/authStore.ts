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
  sendOtp: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null; isNewUser?: boolean }>;
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

      // Set user/session first (but NOT initialized yet — wait for seed)
      set({
        session,
        user: session?.user ?? null,
      });

      // If user is logged in, ensure they have profile + seed data
      if (session?.user) {
        const userId = session.user.id;

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();

        if (!existingProfile) {
          const email = session.user.email || '';
          const displayName = email.split('@')[0];
          const username = displayName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
          console.log('[Auth:init] Creating missing profile');
          await supabase.from('profiles').insert({
            id: userId,
            display_name: displayName,
            username,
            avatar_color: '#007AFF',
          });
        }

        // Check if user has nooks (seed may be missing)
        const { data: userNooks } = await supabase
          .from('nook_members')
          .select('nook_id')
          .eq('user_id', userId)
          .limit(1);

        if (!userNooks || userNooks.length === 0) {
          console.log('[Auth:init] No nooks found — seeding sample data');
          const { error: seedError } = await supabase.rpc('seed_user_data', { target_user_id: userId });
          console.log('[Auth:init] Seed result:', seedError?.message || 'success');
        }
      }

      // NOW mark as initialized — HomeScreen can safely fetch
      set({ initialized: true });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });
      });
    } catch (err: any) {
      console.log('[Auth:init] Error:', err?.message);
      set({ initialized: true });
    }
  },

  sendOtp: async (email: string) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      set({ loading: false });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      set({ loading: false });
      return { error: err.message || 'Something went wrong' };
    }
  },

  verifyOtp: async (email: string, token: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      const user = data.user;
      if (!user) {
        set({ loading: false });
        return { error: 'Verification failed' };
      }

      // Check if profile exists (determines if new user)
      console.log('[Auth] Checking profile for user:', user.id);
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      console.log('[Auth] Profile check:', { existingProfile, profileError: profileError?.message });

      let isNewUser = false;

      if (!existingProfile) {
        isNewUser = true;
        // Create profile for new user
        const displayName = email.split('@')[0];
        const username = displayName.toLowerCase().replace(/[^a-z0-9]/g, '');

        console.log('[Auth] Creating profile:', { id: user.id, displayName, username });
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          display_name: displayName,
          username,
          avatar_color: '#007AFF',
        });
        console.log('[Auth] Profile insert result:', { error: insertError?.message });
      }

      // Check if user has any nooks (seed may have failed previously)
      const { data: userNooks } = await supabase
        .from('nook_members')
        .select('nook_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!userNooks || userNooks.length === 0) {
        console.log('[Auth] No nooks found — seeding sample data');
        const { error: seedError } = await supabase.rpc('seed_user_data', { target_user_id: user.id });
        console.log('[Auth] Seed result:', { error: seedError?.message });
      }

      // Register for push notifications
      registerForPushNotifications(user.id).catch(() => { });

      set({ loading: false });
      return { error: null, isNewUser };
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
