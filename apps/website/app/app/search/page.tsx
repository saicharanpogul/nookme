'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const platformColors: Record<string, string> = {
  instagram: '#E4405F', tiktok: '#000000', youtube: '#FF0000',
  twitter: '#1DA1F2', web: '#86868B', image: '#34C759',
};

interface Nook {
  id: string;
  name: string;
  icon_name: string;
  color: string;
  content_count?: number;
}

interface ContentCard {
  id: string;
  title: string;
  url: string;
  platform: string;
  created_at: string;
}

const iconMap: Record<string, string> = {
  flame: '🔥', rocket: '🚀', airplane: '✈️', people: '👥',
  heart: '❤️', star: '⭐', 'musical-notes': '🎵', camera: '📷',
  'game-controller': '🎮', globe: '🌍', book: '📚', code: '💻',
};

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentCard[]>([]);
  const [nooks, setNooks] = useState<Nook[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchNooks();
  }, []);

  const fetchNooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: memberRows } = await supabase
      .from('nook_members')
      .select('nook_id')
      .eq('user_id', user.id);

    if (!memberRows?.length) return;

    const nookIds = memberRows.map(r => r.nook_id);
    const { data: nooksData } = await supabase
      .from('nooks')
      .select('*')
      .in('id', nookIds);

    const enriched = await Promise.all(
      (nooksData || []).map(async (nook) => {
        const { count } = await supabase
          .from('content_cards')
          .select('*', { count: 'exact', head: true })
          .eq('nook_id', nook.id);
        return { ...nook, content_count: count || 0 };
      })
    );

    setNooks(enriched);
  };

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setSearching(true);
    setHasSearched(true);

    const { data } = await supabase
      .from('content_cards')
      .select('*')
      .or(`title.ilike.%${text.trim()}%,description.ilike.%${text.trim()}%,url.ilike.%${text.trim()}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    setResults(data || []);
    setSearching(false);
  }, []);

  const formatDate = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(d).toLocaleDateString();
  };

  return (
    <>
      <div className="search-header">
        <h1 className="search-title">Search</h1>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search your content..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          autoCorrect="off"
        />
        {query.length > 0 && (
          <button className="search-clear" onClick={() => { setQuery(''); setResults([]); setHasSearched(false); }}>✕</button>
        )}
      </div>

      {query.length < 2 ? (
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
            Your Nooks
          </h3>
          <div className="nook-list">
            {nooks.map(nook => (
              <Link key={nook.id} href={`/app/nook/${nook.id}`} className="nook-card">
                <div className="nook-icon" style={{ backgroundColor: nook.color + '14' }}>
                  {iconMap[nook.icon_name] || '📁'}
                </div>
                <div className="nook-info">
                  <div className="nook-name">{nook.name}</div>
                </div>
                <span className="nook-time">{nook.content_count} items</span>
              </Link>
            ))}
          </div>
        </div>
      ) : searching ? (
        <div className="app-loading"><div className="app-loading-spinner" /></div>
      ) : results.length === 0 && hasSearched ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h2 className="empty-title">No results for &quot;{query}&quot;</h2>
          <p className="empty-text">Try a different search term</p>
        </div>
      ) : (
        <div className="content-grid">
          {results.map(card => (
            <Link key={card.id} href={`/app/thread/${card.id}`} className="content-card">
              <div className="cc-platform">
                <span className="cc-dot" style={{ backgroundColor: platformColors[card.platform] || '#86868B' }} />
                <span style={{ color: platformColors[card.platform] || '#86868B' }}>{card.platform}</span>
              </div>
              <div className="cc-title">{card.title || card.url}</div>
              <span className="cc-thread-count">{formatDate(card.created_at)}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
