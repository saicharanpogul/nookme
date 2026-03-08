'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Nook {
  id: string;
  name: string;
  description: string | null;
  icon_name: string;
  color: string;
  member_count?: number;
  content_count?: number;
}

const iconMap: Record<string, string> = {
  flame: '🔥', rocket: '🚀', airplane: '✈️', people: '👥',
  heart: '❤️', star: '⭐', 'musical-notes': '🎵', camera: '📷',
  'game-controller': '🎮', globe: '🌍', book: '📚', code: '💻',
};

export default function DashboardPage() {
  const router = useRouter();
  const [nooks, setNooks] = useState<Nook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newNookName, setNewNookName] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [ogData, setOgData] = useState<{ title?: string; description?: string; image?: string; siteName?: string } | null>(null);
  const [ogLoading, setOgLoading] = useState(false);

  useEffect(() => {
    fetchNooks();
  }, []);

  // Auto-fetch OG metadata when URL changes
  useEffect(() => {
    if (!shareUrl.trim() || !shareUrl.startsWith('http')) {
      setOgData(null);
      return;
    }
    const timeout = setTimeout(async () => {
      setOgLoading(true);
      try {
        const res = await fetch('/api/og', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: shareUrl.trim() }),
        });
        const data = await res.json();
        setOgData(data);
      } catch {
        setOgData(null);
      }
      setOgLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [shareUrl]);

  const fetchNooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: memberRows } = await supabase
      .from('nook_members')
      .select('nook_id')
      .eq('user_id', user.id);

    if (!memberRows?.length) {
      setNooks([]);
      setLoading(false);
      return;
    }

    const nookIds = memberRows.map(r => r.nook_id);
    const { data: nooksData } = await supabase
      .from('nooks')
      .select('*')
      .in('id', nookIds)
      .order('created_at', { ascending: false });

    const enriched = await Promise.all(
      (nooksData || []).map(async (nook) => {
        const { count: memberCount } = await supabase
          .from('nook_members')
          .select('*', { count: 'exact', head: true })
          .eq('nook_id', nook.id);
        const { count: contentCount } = await supabase
          .from('content_cards')
          .select('*', { count: 'exact', head: true })
          .eq('nook_id', nook.id);
        return { ...nook, member_count: memberCount || 0, content_count: contentCount || 0 };
      })
    );

    setNooks(enriched);
    setLoading(false);
  };

  const handleCreateNook = async () => {
    if (!newNookName.trim() || creating) return;
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const icons = Object.keys(iconMap);
    const colors = ['#007AFF', '#FF9500', '#5856D6', '#FF2D55', '#34C759', '#5AC8FA'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const { data: nook, error } = await supabase
      .from('nooks')
      .insert({ name: newNookName.trim(), description: '', icon_name: randomIcon, color: randomColor, created_by: user.id })
      .select()
      .single();

    if (nook) {
      await supabase.from('nook_members').insert({ nook_id: nook.id, user_id: user.id, role: 'owner' });
      setShowCreateModal(false);
      setNewNookName('');
      router.push(`/app/nook/${nook.id}`);
    }
    setCreating(false);
  };

  const handleShareLink = async () => {
    if (!shareUrl.trim() || creating || nooks.length === 0) return;
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const url = shareUrl.trim();
    let platform = 'web';
    if (url.includes('instagram.com')) platform = 'instagram';
    else if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
    else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'twitter';
    else if (url.includes('tiktok.com')) platform = 'tiktok';

    await supabase.from('content_cards').insert({
      nook_id: nooks[0].id,
      shared_by: user.id,
      url,
      title: ogData?.title || url,
      description: ogData?.description || null,
      platform,
      tags: [],
    });

    setShowShareModal(false);
    setShareUrl('');
    setOgData(null);
    await fetchNooks();
    setCreating(false);
  };

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Your Nooks</h1>
          <p className="dash-subtitle">Shared content spaces</p>
        </div>
        <div className="dash-actions">
          <button className="dash-btn" onClick={() => setShowShareModal(true)}>🔗 Share Link</button>
          <button className="dash-btn dash-btn-primary" onClick={() => setShowCreateModal(true)}>+ New Nook</button>
        </div>
      </div>

      <div className="quick-actions">
        <button className="quick-action-card" onClick={() => setShowCreateModal(true)}>
          <div className="qa-icon">👥</div>
          <div className="qa-label">New Nook</div>
        </button>
        <button className="quick-action-card" onClick={() => {
          navigator.clipboard.writeText('https://nookme.xyz');
          alert('Invite link copied!');
        }}>
          <div className="qa-icon">✉️</div>
          <div className="qa-label">Invite</div>
        </button>
        <button className="quick-action-card" onClick={() => setShowShareModal(true)}>
          <div className="qa-icon">🔗</div>
          <div className="qa-label">Share Link</div>
        </button>
      </div>

      {loading ? (
        <div className="app-loading"><div className="app-loading-spinner" /></div>
      ) : nooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🪐</div>
          <h2 className="empty-title">No nooks yet</h2>
          <p className="empty-text">Create your first nook to start sharing!</p>
          <button className="dash-btn dash-btn-primary" onClick={() => setShowCreateModal(true)}>+ Create Nook</button>
        </div>
      ) : (
        <div className="nook-list">
          {nooks.map(nook => (
            <Link key={nook.id} href={`/app/nook/${nook.id}`} className="nook-card">
              <div className="nook-icon" style={{ backgroundColor: nook.color + '14' }}>
                {iconMap[nook.icon_name] || '📁'}
              </div>
              <div className="nook-info">
                <div className="nook-name">{nook.name}</div>
                <div className="nook-desc">{nook.description}</div>
                <div className="nook-stats">{nook.member_count} members · {nook.content_count} items</div>
              </div>
              {(nook.content_count ?? 0) > 0 && (
                <span className="nook-badge">{nook.content_count}</span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Create Nook Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Create a Nook</h2>
            <input
              className="modal-input"
              placeholder="Nook name..."
              value={newNookName}
              onChange={e => setNewNookName(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleCreateNook()}
            />
            <div className="modal-actions">
              <button className="modal-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn-primary" onClick={handleCreateNook} disabled={!newNookName.trim() || creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Link Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Share a Link</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Paste a URL to save to {nooks[0]?.name || 'your nook'}
            </p>
            <input
              className="modal-input"
              placeholder="https://..."
              value={shareUrl}
              onChange={e => setShareUrl(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleShareLink()}
            />

            {/* OG Preview */}
            {ogLoading && <div className="og-preview-loading">Fetching preview...</div>}
            {ogData && !ogLoading && (ogData.title || ogData.description) && (
              <div className="og-preview">
                {ogData.image && (
                  <img src={ogData.image} alt="" className="og-preview-img" onError={e => (e.currentTarget.style.display = 'none')} />
                )}
                <div className="og-preview-text">
                  <div className="og-preview-title">{ogData.title}</div>
                  {ogData.description && <div className="og-preview-desc">{ogData.description}</div>}
                  {ogData.siteName && <div className="og-preview-site">{ogData.siteName}</div>}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="modal-btn" onClick={() => setShowShareModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn-primary" onClick={handleShareLink} disabled={!shareUrl.trim() || creating}>
                {creating ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
