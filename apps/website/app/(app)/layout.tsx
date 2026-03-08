'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ display_name: string; avatar_color: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_color')
        .eq('id', session.user.id)
        .single();
      if (data) setProfile(data);
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
      </div>
    );
  }

  const navItems = [
    { href: '/app', icon: '🏠', label: 'Home', active: pathname === '/app' },
    { href: '/app/search', icon: '🔍', label: 'Search', active: pathname === '/app/search' },
    { href: '/app/profile', icon: '👤', label: 'Profile', active: pathname === '/app/profile' },
  ];

  const initials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">N</div>
            <span className="sidebar-logo-text">NookMe</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div
              className="sidebar-avatar"
              style={{ backgroundColor: profile?.avatar_color || '#007AFF' }}
            >
              {initials}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{profile?.display_name || 'User'}</span>
            </div>
          </div>
          <button className="sidebar-signout" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="app-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="app-main">
        {/* Mobile header */}
        <header className="app-topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <span className="topbar-title">NookMe</span>
          <div style={{ width: 32 }} />
        </header>

        <div className="app-content">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="app-bottomnav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`bottomnav-item ${item.active ? 'active' : ''}`}
          >
            <span className="bottomnav-icon">{item.icon}</span>
            <span className="bottomnav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
