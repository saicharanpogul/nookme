'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const platformColors: Record<string, string> = {
  instagram: '#E4405F', tiktok: '#000000', youtube: '#FF0000',
  twitter: '#1DA1F2', web: '#86868B', image: '#34C759',
};

interface ContentCard {
  id: string;
  title: string;
  description: string | null;
  url: string;
  platform: string;
  created_at: string;
  reactions: { emoji: string }[];
  messages: { count: number }[];
}

export default function NookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const nookId = params.id as string;
  const [nook, setNook] = useState<any>(null);
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ogData, setOgData] = useState<{ title?: string; description?: string } | null>(null);
  const [ogLoading, setOgLoading] = useState(false);

  useEffect(() => {
    if (nookId) fetchData();
  }, [nookId]);

  const fetchData = async () => {
    const { data: nookData } = await supabase
      .from('nooks')
      .select('*')
      .eq('id', nookId)
      .single();
    setNook(nookData);

    const { data: cardsData } = await supabase
      .from('content_cards')
      .select('*, reactions(*), messages(count)')
      .eq('nook_id', nookId)
      .order('created_at', { ascending: false });

    setCards(cardsData || []);
    setLoading(false);
  };

  // Auto-fetch OG metadata
  useEffect(() => {
    if (!newUrl.trim() || !newUrl.startsWith('http')) {
      setOgData(null);
      return;
    }
    const timeout = setTimeout(async () => {
      setOgLoading(true);
      try {
        const res = await fetch('/api/og', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: newUrl.trim() }),
        });
        const data = await res.json();
        setOgData(data);
      } catch {
        setOgData(null);
      }
      setOgLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [newUrl]);

  const handleAddContent = async () => {
    if (!newUrl.trim() || adding) return;
    setAdding(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const url = newUrl.trim();
    let platform = 'web';
    if (url.includes('instagram.com')) platform = 'instagram';
    else if (url.includes('youtube.com') || url.includes('youtu.be')) platform = 'youtube';
    else if (url.includes('twitter.com') || url.includes('x.com')) platform = 'twitter';
    else if (url.includes('tiktok.com')) platform = 'tiktok';

    await supabase.from('content_cards').insert({
      nook_id: nookId,
      shared_by: user.id,
      url,
      title: ogData?.title || url,
      description: ogData?.description || null,
      platform,
      tags: [],
    });

    setShowAddModal(false);
    setNewUrl('');
    setOgData(null);
    await fetchData();
    setAdding(false);
  };

  const formatDate = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(d).toLocaleDateString();
  };

  if (loading) {
    return <div className="app-loading"><div className="app-loading-spinner" /></div>;
  }

  return (
    <>
      <div className="nook-detail-header">
        <button className="nook-detail-back" onClick={() => router.push('/app')}>←</button>
        <div>
          <h1 className="nook-detail-title">{nook?.name || 'Nook'}</h1>
          {nook?.description && <p className="nook-detail-desc">{nook.description}</p>}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="dash-btn" onClick={() => {
            const inviteUrl = `${window.location.origin}/invite/${nookId}`;
            navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}>
            {copied ? '✓ Copied!' : '🔗 Invite'}
          </button>
          <button className="dash-btn dash-btn-primary" onClick={() => setShowAddModal(true)}>+ Add Content</button>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2 className="empty-title">No content yet</h2>
          <p className="empty-text">Share your first link to this nook!</p>
          <button className="dash-btn dash-btn-primary" onClick={() => setShowAddModal(true)}>+ Add Content</button>
        </div>
      ) : (
        <div className="content-grid">
          {cards.map(card => (
            <Link key={card.id} href={`/app/thread/${card.id}`} className="content-card">
              <div className="cc-platform">
                <span className="cc-dot" style={{ backgroundColor: platformColors[card.platform] || '#86868B' }} />
                <span style={{ color: platformColors[card.platform] || '#86868B' }}>{card.platform || 'web'}</span>
              </div>
              <div className="cc-title">{card.title || card.url}</div>
              {card.description && <div className="cc-desc">{card.description}</div>}
              <div className="cc-footer">
                <div className="cc-reactions">
                  {(card.reactions || []).slice(0, 3).map((r, i) => (
                    <span key={i} className="cc-reaction">{r.emoji}</span>
                  ))}
                </div>
                <span className="cc-thread-count">
                  💬 {card.messages?.[0]?.count || 0} · {formatDate(card.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Add Content</h2>
            <input
              className="modal-input"
              placeholder="Paste a URL..."
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAddContent()}
            />

            {ogLoading && <div className="og-preview-loading">Fetching preview...</div>}
            {ogData && !ogLoading && (ogData.title || ogData.description) && (
              <div className="og-preview">
                <div className="og-preview-text">
                  <div className="og-preview-title">{ogData.title}</div>
                  {ogData.description && <div className="og-preview-desc">{ogData.description}</div>}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="modal-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn-primary" onClick={handleAddContent} disabled={!newUrl.trim() || adding}>
                {adding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
