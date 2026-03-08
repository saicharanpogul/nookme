'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface ProfileData {
  display_name: string;
  username: string;
  avatar_color: string;
}

interface Stats {
  nookCount: number;
  sharedCount: number;
  reactionCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<Stats>({ nookCount: 0, sharedCount: 0, reactionCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('display_name, username, avatar_color')
      .eq('id', user.id)
      .single();

    if (profileData) setProfile(profileData);

    const [nookRes, sharedRes, reactionRes] = await Promise.all([
      supabase.from('nook_members').select('nook_id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('content_cards').select('id', { count: 'exact', head: true }).eq('shared_by', user.id),
      supabase.from('reactions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);

    setStats({
      nookCount: nookRes.count || 0,
      sharedCount: sharedRes.count || 0,
      reactionCount: reactionRes.count || 0,
    });
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="app-loading"><div className="app-loading-spinner" /></div>;

  const initials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar" style={{ backgroundColor: profile?.avatar_color || '#007AFF' }}>
          {initials}
        </div>
        <h2 className="profile-name">{profile?.display_name || 'User'}</h2>
        <p className="profile-username">@{profile?.username || 'user'}</p>

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">{stats.nookCount}</div>
            <div className="profile-stat-label">Nooks</div>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <div className="profile-stat-value">{stats.sharedCount}</div>
            <div className="profile-stat-label">Shared</div>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <div className="profile-stat-value">{stats.reactionCount}</div>
            <div className="profile-stat-label">Reactions</div>
          </div>
        </div>
      </div>

      <button
        className="dash-btn"
        style={{ width: '100%', justifyContent: 'center', color: 'var(--accent-red)', borderColor: 'rgba(255, 59, 48, 0.2)', background: 'rgba(255, 59, 48, 0.04)' }}
        onClick={handleSignOut}
      >
        🚪 Sign Out
      </button>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
        NookMe v0.1.0
      </p>
    </>
  );
}
