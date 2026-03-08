import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { fetchLinkMetadata } from '@/lib/linkPreview';

/* ─── Types ──────────────────────────────────────────────── */
export interface Profile {
  id: string;
  display_name: string;
  username: string;
  avatar_color: string;
}

export interface Nook {
  id: string;
  name: string;
  description: string | null;
  icon_name: string;
  color: string;
  created_by: string;
  created_at: string;
  member_count?: number;
  content_count?: number;
  last_activity?: string;
}

export interface ContentCard {
  id: string;
  nook_id: string;
  shared_by: string;
  url: string;
  title: string | null;
  description: string | null;
  platform: string;
  creator: string | null;
  tags: string[];
  created_at: string;
  // Computed
  shared_by_profile?: Profile;
  reaction_counts?: { emoji: string; count: number }[];
  thread_count?: number;
}

export interface Message {
  id: string;
  card_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  sender_profile?: Profile;
}

/* ─── Store ──────────────────────────────────────────────── */
interface NookState {
  nooks: Nook[];
  nooksLoading: boolean;
  contentCards: ContentCard[];
  cardsLoading: boolean;
  messages: Message[];
  messagesLoading: boolean;

  fetchNooks: () => Promise<void>;
  fetchContentCards: (nookId: string) => Promise<void>;
  fetchMessages: (cardId: string) => Promise<void>;
  sendMessage: (cardId: string, text: string) => Promise<void>;
  toggleReaction: (cardId: string, emoji: string) => Promise<void>;
  deleteNook: (nookId: string) => Promise<void>;
  deleteContentCard: (cardId: string) => Promise<void>;
  createContentCard: (nookId: string, url: string) => Promise<string | null>;
  createNook: (name: string, description: string, iconName?: string, color?: string) => Promise<string | null>;
  searchContent: (query: string) => Promise<ContentCard[]>;
}

export const useNookStore = create<NookState>((set, get) => ({
  nooks: [],
  nooksLoading: false,
  contentCards: [],
  cardsLoading: false,
  messages: [],
  messagesLoading: false,

  fetchNooks: async () => {
    set({ nooksLoading: true });
    try {
      // Get nooks where user is a member
      const { data: memberRows } = await supabase
        .from('nook_members')
        .select('nook_id');

      if (!memberRows?.length) {
        set({ nooks: [], nooksLoading: false });
        return;
      }

      const nookIds = memberRows.map((r) => r.nook_id);

      const { data: nooks } = await supabase
        .from('nooks')
        .select('*')
        .in('id', nookIds)
        .order('created_at', { ascending: false });

      // Enrich with counts
      const enriched: Nook[] = await Promise.all(
        (nooks || []).map(async (nook) => {
          const { count: memberCount } = await supabase
            .from('nook_members')
            .select('*', { count: 'exact', head: true })
            .eq('nook_id', nook.id);

          const { count: contentCount } = await supabase
            .from('content_cards')
            .select('*', { count: 'exact', head: true })
            .eq('nook_id', nook.id);

          // Get latest content card timestamp for "last activity"
          const { data: latest } = await supabase
            .from('content_cards')
            .select('created_at')
            .eq('nook_id', nook.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const lastActivity = latest?.[0]?.created_at
            ? formatRelativeTime(latest[0].created_at)
            : formatRelativeTime(nook.created_at);

          return {
            ...nook,
            member_count: memberCount || 0,
            content_count: contentCount || 0,
            last_activity: lastActivity,
          };
        })
      );

      set({ nooks: enriched, nooksLoading: false });
    } catch {
      set({ nooksLoading: false });
    }
  },

  fetchContentCards: async (nookId) => {
    set({ cardsLoading: true });
    try {
      const { data: cards } = await supabase
        .from('content_cards')
        .select('*')
        .eq('nook_id', nookId)
        .order('created_at', { ascending: false });

      // Enrich with profiles, reaction counts, thread counts
      const enriched: ContentCard[] = await Promise.all(
        (cards || []).map(async (card) => {
          // Shared by profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', card.shared_by)
            .single();

          // Reactions grouped by emoji
          const { data: reactions } = await supabase
            .from('reactions')
            .select('emoji')
            .eq('card_id', card.id);

          const reactionMap: Record<string, number> = {};
          (reactions || []).forEach((r) => {
            reactionMap[r.emoji] = (reactionMap[r.emoji] || 0) + 1;
          });
          const reaction_counts = Object.entries(reactionMap).map(([emoji, count]) => ({
            emoji,
            count,
          }));

          // Thread count
          const { count: threadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('card_id', card.id);

          return {
            ...card,
            shared_by_profile: profile || undefined,
            reaction_counts,
            thread_count: threadCount || 0,
          };
        })
      );

      set({ contentCards: enriched, cardsLoading: false });
    } catch {
      set({ cardsLoading: false });
    }
  },

  fetchMessages: async (cardId) => {
    set({ messagesLoading: true });
    try {
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('card_id', cardId)
        .order('created_at', { ascending: true });

      // Enrich with sender profiles
      const enriched: Message[] = await Promise.all(
        (msgs || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', msg.sender_id)
            .single();
          return { ...msg, sender_profile: profile || undefined };
        })
      );

      set({ messages: enriched, messagesLoading: false });
    } catch {
      set({ messagesLoading: false });
    }
  },

  sendMessage: async (cardId, text) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: msg } = await supabase
      .from('messages')
      .insert({ card_id: cardId, sender_id: user.id, text })
      .select()
      .single();

    if (msg) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      set((state) => ({
        messages: [...state.messages, { ...msg, sender_profile: profile || undefined }],
      }));
    }
  },

  toggleReaction: async (cardId, emoji) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if reaction exists
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('card_id', cardId)
      .eq('user_id', user.id)
      .eq('emoji', emoji)
      .single();

    if (existing) {
      await supabase.from('reactions').delete().eq('id', existing.id);
    } else {
      await supabase.from('reactions').insert({ card_id: cardId, user_id: user.id, emoji });
    }

    // Refresh the card's data
    const nookId = get().contentCards.find((c) => c.id === cardId)?.nook_id;
    if (nookId) {
      get().fetchContentCards(nookId);
    }
  },

  deleteNook: async (nookId) => {
    await supabase.from('nooks').delete().eq('id', nookId);
    set((state) => ({
      nooks: state.nooks.filter((n) => n.id !== nookId),
    }));
  },

  deleteContentCard: async (cardId) => {
    await supabase.from('content_cards').delete().eq('id', cardId);
    set((state) => ({
      contentCards: state.contentCards.filter((c) => c.id !== cardId),
    }));
  },

  createContentCard: async (nookId, url) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch link metadata (title, description, platform)
    const meta = await fetchLinkMetadata(url);

    const { data: card, error } = await supabase
      .from('content_cards')
      .insert({
        nook_id: nookId,
        shared_by: user.id,
        url: meta.url,
        title: meta.title,
        description: meta.description || null,
        platform: meta.platform,
        creator: null,
        tags: [],
      })
      .select()
      .single();

    if (error || !card) return null;
    return card.id;
  },

  createNook: async (name, description, iconName = 'people', color = '#007AFF') => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('[Nook] createNook user:', user?.id);
    if (!user) return null;

    const { data: nook, error } = await supabase
      .from('nooks')
      .insert({
        name,
        description,
        icon_name: iconName,
        color,
        created_by: user.id,
      })
      .select()
      .single();

    console.log('[Nook] Insert result:', { nookId: nook?.id, error: error?.message });
    if (error || !nook) return null;

    // Add creator as owner
    const { error: memberError } = await supabase.from('nook_members').insert({
      nook_id: nook.id,
      user_id: user.id,
      role: 'owner',
    });
    console.log('[Nook] Member insert:', { error: memberError?.message });

    // Refresh nooks list
    await get().fetchNooks();
    return nook.id;
  },

  searchContent: async (query) => {
    const { data, error } = await supabase
      .from('content_cards')
      .select(`
        *,
        shared_by_profile:profiles!content_cards_shared_by_fkey (
          id, display_name, username, avatar_color
        ),
        reactions (*),
        messages (count)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,url.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data) return [];

    return data.map((card: any) => ({
      ...card,
      shared_by_profile: card.shared_by_profile,
      reactions: card.reactions || [],
      message_count: card.messages?.[0]?.count || 0,
    }));
  },
}));

/* ─── Helpers ──────────────────────────────────────────────── */
function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return new Date(dateStr).toLocaleDateString();
}
