'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const platformColors: Record<string, string> = {
  instagram: '#E4405F', tiktok: '#000000', youtube: '#FF0000',
  twitter: '#1DA1F2', web: '#86868B', image: '#34C759',
};

const EMOJI_OPTIONS = ['😂', '🔥', '❤️', '🤯', '💯', '👀', '🙌'];

interface Message {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
  profile?: { display_name: string; avatar_color: string };
}

interface Reaction {
  id: string;
  emoji: string;
  user_id: string;
}

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.id as string;
  const [card, setCard] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardId) fetchData();
  }, [cardId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);

    const { data: cardData } = await supabase
      .from('content_cards')
      .select('*')
      .eq('id', cardId)
      .single();
    setCard(cardData);

    const { data: msgData } = await supabase
      .from('messages')
      .select('*, profile:profiles!messages_sender_id_fkey(display_name, avatar_color)')
      .eq('card_id', cardId)
      .order('created_at', { ascending: true });
    setMessages(msgData || []);

    const { data: rxnData } = await supabase
      .from('reactions')
      .select('*')
      .eq('card_id', cardId);
    setReactions(rxnData || []);

    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('messages').insert({
      card_id: cardId,
      sender_id: user.id,
      text: newMessage.trim(),
    });

    setNewMessage('');
    await fetchData();
  };

  const toggleReaction = async (emoji: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const existing = reactions.find(r => r.emoji === emoji && r.user_id === user.id);
    if (existing) {
      await supabase.from('reactions').delete().eq('id', existing.id);
    } else {
      await supabase.from('reactions').insert({ card_id: cardId, user_id: user.id, emoji });
    }
    await fetchData();
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group reactions by emoji
  const reactionGroups = EMOJI_OPTIONS.map(emoji => ({
    emoji,
    count: reactions.filter(r => r.emoji === emoji).length,
    active: reactions.some(r => r.emoji === emoji && r.user_id === userId),
  })).filter(r => r.count > 0 || true);

  if (loading) {
    return <div className="app-loading"><div className="app-loading-spinner" /></div>;
  }

  return (
    <>
      <div className="thread-header">
        <button className="thread-back" onClick={() => {
          if (card?.nook_id) router.push(`/app/nook/${card.nook_id}`);
          else router.push('/app');
        }}>← Back</button>

        <div className="thread-card">
          <div className="thread-card-platform">
            <span className="cc-dot" style={{ backgroundColor: platformColors[card?.platform] || '#86868B' }} />
            <span style={{ color: platformColors[card?.platform] || '#86868B' }}>{card?.platform || 'web'}</span>
          </div>
          <h1 className="thread-card-title">{card?.title || card?.url}</h1>
          {card?.description && <p className="thread-card-desc">{card.description}</p>}
          <a href={card?.url} target="_blank" rel="noopener noreferrer" className="thread-card-url">
            {card?.url}
          </a>

          <div className="thread-reactions">
            {reactionGroups.map(({ emoji, count, active }) => (
              <button
                key={emoji}
                className={`thread-reaction-btn ${active ? 'active' : ''}`}
                onClick={() => toggleReaction(emoji)}
              >
                {emoji}
                {count > 0 && <span className="thread-reaction-count">{count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="messages-section">
        <h3 className="messages-title">Thread · {messages.length} messages</h3>

        <div className="messages-list">
          {messages.map(msg => {
            const isOwn = msg.sender_id === userId;
            const profile = (msg as any).profile;
            const initials = profile?.display_name?.slice(0, 2).toUpperCase() || '?';
            return (
              <div key={msg.id} className={`message-bubble ${isOwn ? 'own' : ''}`}>
                <div className="message-avatar" style={{ backgroundColor: profile?.avatar_color || '#007AFF' }}>
                  {initials}
                </div>
                <div className="message-content">
                  {!isOwn && <div className="message-sender">{profile?.display_name || 'User'}</div>}
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{formatTime(msg.created_at)}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input-wrap">
          <input
            className="message-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="message-send-btn" onClick={sendMessage} disabled={!newMessage.trim()}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
