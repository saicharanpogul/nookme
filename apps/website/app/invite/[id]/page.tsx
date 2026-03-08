'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { NookMeWordmark } from '@/components/NookMeLogo';

const iconMap: Record<string, string> = {
  flame: '🔥', rocket: '🚀', airplane: '✈️', people: '👥',
  heart: '❤️', star: '⭐', 'musical-notes': '🎵', camera: '📷',
  'game-controller': '🎮', globe: '🌍', book: '📚', code: '💻',
};

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const nookId = params.id as string;
  const [nook, setNook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [alreadyMember, setAlreadyMember] = useState(false);

  useEffect(() => {
    if (nookId) fetchNook();
  }, [nookId]);

  const fetchNook = async () => {
    // Fetch nook info (public)
    const { data: nookData } = await supabase
      .from('nooks')
      .select('*')
      .eq('id', nookId)
      .single();

    if (!nookData) {
      setError('Nook not found');
      setLoading(false);
      return;
    }
    setNook(nookData);

    // Check if user is already a member
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: member } = await supabase
        .from('nook_members')
        .select('nook_id')
        .eq('nook_id', nookId)
        .eq('user_id', user.id)
        .single();
      if (member) setAlreadyMember(true);
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    setJoining(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Not logged in — redirect to login, then come back
      router.push(`/login?redirect=/invite/${nookId}`);
      return;
    }

    // Check if already member
    const { data: existing } = await supabase
      .from('nook_members')
      .select('nook_id')
      .eq('nook_id', nookId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      router.push(`/app/nook/${nookId}`);
      return;
    }

    // Join
    const { error } = await supabase.from('nook_members').insert({
      nook_id: nookId,
      user_id: user.id,
      role: 'member',
    });

    if (error) {
      setError('Failed to join. Please try again.');
      setJoining(false);
      return;
    }

    router.push(`/app/nook/${nookId}`);
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="app-loading"><div className="app-loading-spinner" /></div>
      </div>
    );
  }

  if (error && !nook) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <NookMeWordmark height={36} />
          </div>
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h2 className="empty-title">{error}</h2>
            <p className="empty-text">This invite link may be expired or invalid.</p>
            <button className="login-button" onClick={() => router.push('/login')}>Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <NookMeWordmark height={36} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>
            {iconMap[nook?.icon_name] || '📁'}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{nook?.name}</h2>
          {nook?.description && (
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{nook.description}</p>
          )}
        </div>

        <p className="login-subtitle">You&apos;ve been invited to join this nook</p>

        {alreadyMember ? (
          <button className="login-button" onClick={() => router.push(`/app/nook/${nookId}`)}>
            Open Nook →
          </button>
        ) : (
          <button className="login-button" onClick={handleJoin} disabled={joining}>
            {joining ? 'Joining...' : 'Join Nook'}
          </button>
        )}

        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}
