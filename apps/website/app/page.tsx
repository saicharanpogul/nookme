'use client';

import { useState, useEffect, FormEvent } from 'react';
import { NookMeLogo } from '@/components/NookMeLogo';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ─── Icons (inline SVG helpers) ─────────────────────────── */
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ChatIcon({ size = 10, stroke = 'currentColor' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* ─── Navbar ──────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          <NookMeLogo size={28} />
          <span>NookMe</span>
        </a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#waitlist" className="nav-link">Waitlist</a>
        </div>
        <a href="#waitlist" className="nav-cta-button">Get Early Access</a>
      </div>
    </nav>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Coming Soon. Join the Waitlist
        </div>

        <h1 className="hero-title">
          Share Links.<br />
          <span className="hero-title-accent">Start Conversations.</span>
        </h1>

        <p className="hero-subtitle">
          NookMe turns every shared link into a structured content card with its own thread.
          No more losing great content in endless chat scrolls.
        </p>

        <div className="hero-cta-group">
          <a href="#waitlist" className="btn btn-primary btn-large">
            Join the Waitlist <ArrowIcon />
          </a>
          <a href="#how-it-works" className="btn btn-ghost btn-large">
            See How it Works
          </a>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">&infin;</span>
            <span className="hero-stat-label">Shared Objects</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">0</span>
            <span className="hero-stat-label">Lost Conversations</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">100%</span>
            <span className="hero-stat-label">Contextual</span>
          </div>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="hero-mockup">
        <div className="mockup-phone">
          <div className="mockup-notch" />
          <div className="mockup-screen">
            <div className="mockup-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              <div>
                <div className="mockup-header-title">Meme Lords</div>
                <div className="mockup-header-sub">4 members · 847 items</div>
              </div>
            </div>

            {/* Card 1 — Instagram */}
            <div className="mockup-card">
              <div className="mockup-card-platform">
                <span className="mockup-dot" style={{ background: '#E4405F' }} />
                Instagram
              </div>
              <div className="mockup-card-body">
                <div className="mockup-card-thumb" style={{ background: 'rgba(228,64,95,0.08)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="#E4405F" stroke="none" /></svg>
                </div>
                <div>
                  <div className="mockup-card-title">This cat learned to open doors</div>
                  <div className="mockup-card-desc">Wait for it... the ending is insane</div>
                </div>
              </div>
              <div className="mockup-card-reactions">
                <span className="mockup-reaction">😂 3</span>
                <span className="mockup-reaction">🔥 1</span>
                <span className="mockup-thread"><ChatIcon /> 5</span>
              </div>
            </div>

            {/* Card 2 — YouTube */}
            <div className="mockup-card">
              <div className="mockup-card-platform">
                <span className="mockup-dot" style={{ background: '#FF0000' }} />
                YouTube
              </div>
              <div className="mockup-card-body">
                <div className="mockup-card-thumb" style={{ background: 'rgba(255,0,0,0.08)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000"><path d="M23 7s-.3-2-1.2-2.8C20.7 3.2 19.5 3 12 3S3.3 3.2 2.2 4.2C1.3 5 1 7 1 7s-.3 2-.3 4v1.6c0 2 .3 4 .3 4s.3 2 1.2 2.8c1.1 1 2.6 1 3.8 1.2 2.7.2 8 .3 8 .3s7.5 0 9.8-1.2c.9-.8 1.2-2.8 1.2-2.8s.3-2 .3-4V11c0-2-.3-4-.3-4zM10 15V9l5.5 3-5.5 3z" /></svg>
                </div>
                <div>
                  <div className="mockup-card-title">How to Build a $1M SaaS</div>
                  <div className="mockup-card-desc">Step-by-step guide</div>
                </div>
              </div>
              <div className="mockup-card-reactions">
                <span className="mockup-reaction">🤯 4</span>
                <span className="mockup-reaction">💯 2</span>
                <span className="mockup-thread"><ChatIcon /> 12</span>
              </div>
            </div>

            {/* Card 3 — X */}
            <div className="mockup-card">
              <div className="mockup-card-platform">
                <span className="mockup-dot" style={{ background: '#000' }} />
                X
              </div>
              <div className="mockup-card-body">
                <div className="mockup-card-thumb" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>𝕏</span>
                </div>
                <div>
                  <div className="mockup-card-title">The future of AI is wild</div>
                  <div className="mockup-card-desc">Thread on what&apos;s coming</div>
                </div>
              </div>
              <div className="mockup-card-reactions">
                <span className="mockup-reaction">👀 5</span>
                <span className="mockup-thread"><ChatIcon /> 8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Problem ──────────────────────────────────────────────── */
function ProblemSection() {
  const ref = useScrollReveal();

  const problems = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" opacity="0.5" /></svg>
      ),
      title: 'Content Gets Lost',
      text: 'That amazing video someone shared? Good luck finding it in 500 messages of side conversations.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="9" y1="10" x2="15" y2="10" opacity="0.5" /></svg>
      ),
      title: 'Conversations Lose Context',
      text: 'Replies to a shared link often get buried under unrelated messages. The discussion fragments.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5856D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" opacity="0.5" /><path d="M9 3v18" opacity="0.5" /></svg>
      ),
      title: 'No Shared Memory',
      text: 'Your group has years of curated taste, but no way to browse, search, or revisit it.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /><path d="M12 2v2" opacity="0.5" /></svg>
      ),
      title: 'Re-sharing is Awkward',
      text: 'Sending the same link to multiple groups means re-explaining context every single time.',
    },
  ];

  return (
    <section className="problem" id="problem" ref={ref}>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">The Problem</span>
          <h2 className="section-title">Your Best Content <span className="text-accent">Deserves Better</span></h2>
          <p className="section-subtitle">In group chats, great content gets lost in the scroll. NookMe was built to fix that.</p>
        </div>

        <div className="problem-grid">
          {problems.map((p, i) => (
            <div key={i} className="problem-card animate-item">
              <div className="problem-icon-wrap">{p.icon}</div>
              <h3 className="problem-card-title">{p.title}</h3>
              <p className="problem-card-text">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─────────────────────────────────────────────── */
function FeaturesSection() {
  const ref = useScrollReveal();

  return (
    <section className="features" id="features" ref={ref}>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Built for <span className="text-accent">Content Sharing</span></h2>
          <p className="section-subtitle">Every feature is designed to make shared content the center of conversation.</p>
        </div>

        <div className="features-grid">
          {/* Hero feature — Nooks */}
          <div className="feature-card feature-card-large animate-item">
            <div className="feature-icon-large">
              <NookMeLogo size={48} />
            </div>
            <h3 className="feature-title">Nooks</h3>
            <p className="feature-description">Private content spaces for your inner circle. Every nook is a curated feed of shared links, each with its own dedicated thread.</p>
            <div className="feature-visual">
              <div className="feature-nook-preview">
                <div className="fnp-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10c0 .3 0 .6-.1.9a3 3 0 0 1-1.5 2.2c-.5.3-1 .4-1.5.4a4 4 0 0 1-4-4c0-.5.1-1 .3-1.5" /></svg>
                  Meme Lords
                  <span className="fnp-badge">12</span>
                </div>
                <div className="fnp-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5856D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                  Startup Gang
                  <span className="fnp-badge">3</span>
                </div>
                <div className="fnp-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5AC8FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>
                  Travel Inspo
                </div>
              </div>
            </div>
          </div>

          {/* Content Cards */}
          <div className="feature-card animate-item">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
            </div>
            <h3 className="feature-title">Content Cards</h3>
            <p className="feature-description">Every link becomes a rich, structured card with platform detection, previews, and metadata.</p>
          </div>

          {/* Threaded */}
          <div className="feature-card animate-item">
            <div className="feature-icon">
              <ChatIcon size={28} stroke="#34C759" />
            </div>
            <h3 className="feature-title">Threaded Discussions</h3>
            <p className="feature-description">Every content card has its own dedicated conversation thread. Context is never lost.</p>
          </div>

          {/* Reactions */}
          <div className="feature-card animate-item">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF2D55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
            </div>
            <h3 className="feature-title">Rich Reactions</h3>
            <p className="feature-description">Express yourself beyond text. React to any content card or message with emojis.</p>
            <div className="feature-reactions-demo">
              {['😂', '🔥', '❤️', '🤯', '💯'].map((emoji) => (
                <div key={emoji} className="frd-emoji">{emoji}</div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="feature-card animate-item">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
            <h3 className="feature-title">Search &amp; Tags</h3>
            <p className="feature-description">Find anything instantly. Tag content for easy categorization and discovery.</p>
          </div>

          {/* Multi-platform */}
          <div className="feature-card animate-item">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5856D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </div>
            <h3 className="feature-title">Multi-Platform</h3>
            <p className="feature-description">Share from Instagram, YouTube, X, TikTok, or any website.</p>
            <div className="feature-platforms">
              <span className="fp-badge" style={{ '--fp-color': '#E4405F' } as React.CSSProperties}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="#E4405F" stroke="none" /></svg>
              </span>
              <span className="fp-badge" style={{ '--fp-color': '#FF0000' } as React.CSSProperties}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000"><path d="M23 7s-.3-2-1.2-2.8C20.7 3.2 19.5 3 12 3S3.3 3.2 2.2 4.2C1.3 5 1 7 1 7s-.3 2-.3 4v1.6c0 2 .3 4 .3 4s.3 2 1.2 2.8c1.1 1 2.6 1 3.8 1.2 2.7.2 8 .3 8 .3s7.5 0 9.8-1.2c.9-.8 1.2-2.8 1.2-2.8s.3-2 .3-4V11c0-2-.3-4-.3-4zM10 15V9l5.5 3-5.5 3z" /></svg>
              </span>
              <span className="fp-badge" style={{ '--fp-color': '#000' } as React.CSSProperties}>
                <span style={{ fontSize: 14, fontWeight: 800 }}>𝕏</span>
              </span>
              <span className="fp-badge" style={{ '--fp-color': '#000' } as React.CSSProperties}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.83 1.56V6.84a4.84 4.84 0 0 1-1.07-.15z" /></svg>
              </span>
              <span className="fp-badge" style={{ '--fp-color': '#86868B' } as React.CSSProperties}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How it Works ─────────────────────────────────────────── */
function HowItWorks() {
  const ref = useScrollReveal();

  return (
    <section className="how-it-works" id="how-it-works" ref={ref}>
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">How it Works</span>
          <h2 className="section-title">Sharing in <span className="text-accent">Three Steps</span></h2>
          <p className="section-subtitle">Content sharing shouldn&apos;t be complicated. We made it effortless.</p>
        </div>

        <div className="steps-grid">
          {/* Step 1 */}
          <div className="step-card animate-item">
            <span className="step-number">01</span>
            <div className="step-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            </div>
            <h3 className="step-title">Drop a Link</h3>
            <p className="step-text">Paste any link from Instagram, YouTube, X, TikTok, or the web.</p>
            <div className="sv-url-bar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              <span className="sv-url">instagram.com/reel/xyz123</span>
            </div>
          </div>

          <div className="step-connector">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </div>

          {/* Step 2 */}
          <div className="step-card animate-item">
            <span className="step-number">02</span>
            <div className="step-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
            </div>
            <h3 className="step-title">Auto-Generated Card</h3>
            <p className="step-text">NookMe creates a rich content card with preview, platform info, and metadata.</p>
            <div className="sv-card">
              <div className="sv-card-thumb" style={{ background: 'rgba(228,64,95,0.08)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /></svg>
              </div>
              <div>
                <div className="sv-card-title">This cat learned to open doors</div>
                <div className="sv-card-meta">Instagram · @catlovers · 2 min ago</div>
              </div>
            </div>
          </div>

          <div className="step-connector">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </div>

          {/* Step 3 */}
          <div className="step-card animate-item">
            <span className="step-number">03</span>
            <div className="step-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5856D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <h3 className="step-title">Discuss in Thread</h3>
            <p className="step-text">React, comment, and discuss, all in a dedicated thread for that specific content.</p>
            <div className="sv-messages">
              <div className="sv-msg sv-msg-other">This is literally me every morning 😂</div>
              <div className="sv-msg sv-msg-me">The part where it stares at the camera 💀</div>
              <div className="sv-msg sv-msg-other">We need to try this with your cat</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Waitlist ──────────────────────────────────────────────── */
function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    try {
      const res = await fetch('https://zqgevegynjtvhalsgxyd.supabase.co/rest/v1/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'sb_publishable_X78ylZJiLBjVyx9WKgi2Yg_mwKbePyh',
          'Authorization': 'Bearer sb_publishable_X78ylZJiLBjVyx9WKgi2Yg_mwKbePyh',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const text = await res.text();
        if (text.includes('duplicate')) {
          // Already on the list — still show success
          setStatus('success');
        } else {
          throw new Error(text);
        }
      } else {
        setStatus('success');
      }
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <section className="waitlist" id="waitlist">
      <div className="section-container">
        <div className="waitlist-card">
          <div className="waitlist-content">
            <div className="waitlist-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" /></svg>
            </div>
            <h2 className="waitlist-title">Be the First to <span className="text-accent">Nook</span></h2>
            <p className="waitlist-subtitle">
              Join the waitlist and get early access when we launch.<br />
              Your shared content deserves better than a chat scroll.
            </p>

            <form onSubmit={handleSubmit} className="waitlist-form">
              <div className="waitlist-input-group">
                <input
                  type="email"
                  className="waitlist-input"
                  placeholder={status === 'success' ? 'Welcome aboard!' : 'you@email.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'submitting'}
                />
                <button
                  type="submit"
                  className="btn btn-primary waitlist-submit"
                  style={status === 'success' ? { background: '#34C759' } : undefined}
                  disabled={status === 'submitting'}
                >
                  {status === 'success' ? '✓ You\'re on the list!' : 'Join Waitlist'}
                  {status === 'idle' && <ArrowIcon />}
                </button>
              </div>
            </form>

            <p className="waitlist-privacy">No spam, ever. We respect your inbox.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <NookMeLogo size={24} />
            <span className="footer-logo-text">NookMe</span>
          </div>
          <p className="footer-tagline">Your shared content space.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <span className="footer-col-title">Product</span>
            <a href="#features" className="footer-link">Features</a>
            <a href="#how-it-works" className="footer-link">How it Works</a>
            <a href="#waitlist" className="footer-link">Early Access</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Company</span>
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Careers</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Legal</span>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">&copy; 2026 NookMe. Built with care.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <WaitlistSection />
      <Footer />
    </>
  );
}
