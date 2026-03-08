'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setStep('otp');
    setCountdown(60);
    setLoading(false);
    setTimeout(() => otpRef.current?.focus(), 100);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6 || loading) return;
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp,
      type: 'email',
    });

    if (error) {
      setError(error.message);
      setOtp('');
      setLoading(false);
      return;
    }

    if (data.user) {
      // Check/create profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        const displayName = email.split('@')[0];
        const username = displayName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
        await supabase.from('profiles').insert({
          id: data.user.id,
          display_name: displayName,
          username,
          avatar_color: '#007AFF',
        });
      }

      // Check/seed data
      const { data: nooks } = await supabase
        .from('nook_members')
        .select('nook_id')
        .eq('user_id', data.user.id)
        .limit(1);

      if (!nooks || nooks.length === 0) {
        await supabase.rpc('seed_user_data', { target_user_id: data.user.id });
      }

      router.push('/app');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
    });
    setCountdown(60);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">N</div>
          <h1 className="login-title">NookMe</h1>
        </div>
        <p className="login-subtitle">
          {step === 'email'
            ? 'Sign in to your shared content space'
            : 'Enter the code from your email'}
        </p>

        {error && <div className="login-error">{error}</div>}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="login-input-group">
              <label className="login-label">Email</label>
              <input
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={!email.trim() || loading}
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <p className="login-otp-email">
              Code sent to <strong>{email}</strong>
            </p>
            <div className="login-input-group">
              <label className="login-label">Verification Code</label>
              <input
                ref={otpRef}
                type="text"
                className="login-input login-input-otp"
                placeholder="Enter code"
                value={otp}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                  setOtp(clean);
                }}
                maxLength={8}
                autoFocus
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={otp.length < 6 || loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <div className="login-actions">
              <button
                type="button"
                className="login-link"
                onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              >
                ← Change email
              </button>
              <button
                type="button"
                className="login-link"
                onClick={handleResend}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        <p className="login-footer">
          <span className="login-shield">🔒</span> Passwordless login — no password needed
        </p>
      </div>
    </div>
  );
}
