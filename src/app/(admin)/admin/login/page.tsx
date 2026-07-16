'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/features/admin';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Eye, EyeOff, AlertTriangle, LogIn } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || 'Login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--admin-bg-card)',
        padding: '24px',
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(26, 35, 50, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(26, 35, 50, 0.03) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '2rem',
              color: 'var(--admin-primary)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
            }}
          >
            HaloArsitek
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '0.6875rem',
              color: 'var(--admin-text-secondary)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Admin Content Management
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: 'var(--admin-bg-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: '16px',
            padding: '40px 32px',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontSize: '1.25rem',
              color: 'var(--admin-text-primary)',
              fontWeight: 600,
              margin: '0 0 8px',
            }}
          >
            Sign In to Dashboard
          </h2>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--admin-text-secondary)',
              margin: '0 0 32px',
            }}
          >
            Manage HaloArsitek website content
          </p>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '24px',
                fontSize: '0.8125rem',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  color: 'var(--admin-text-secondary)',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@haloarsitek.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--admin-bg-card)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '32px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  color: 'var(--admin-text-secondary)',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    background: 'var(--admin-bg-card)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    color: 'var(--admin-text-primary)',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-outfit), sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--admin-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: isSubmitting
                  ? '#3C3C3E'
                  : 'var(--admin-primary)',
                border: 'none',
                borderRadius: '8px',
                color: isSubmitting ? '#8A8A8E' : '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'var(--font-outfit), sans-serif',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <LogIn size={16} /> {isSubmitting ? 'Processing...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.6875rem',
            color: '#3C3C3E',
            marginTop: '32px',
            fontFamily: 'var(--font-outfit), sans-serif',
          }}
        >
          © 2025 HaloArsitek. Admin Panel v1.0
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--admin-bg-card)' }}>
        <div style={{ color: 'var(--admin-text-secondary)' }}>Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
