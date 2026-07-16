'use client';

import { useAuth } from '../context/auth-context';
import { useAdminUI } from '../context/admin-ui-context';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu as MenuIcon, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function AdminTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { admin } = useAuth();
  const { isMobile, toggleMobileSidebar } = useAdminUI();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      style={{
        padding: isMobile ? '0 16px' : '0 32px',
        height: '80px',
        boxShadow: 'var(--admin-shadow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--admin-bg-card)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isMobile && (
          <button
            onClick={toggleMobileSidebar}
            style={{
              padding: '8px',
              background: 'transparent',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              color: 'var(--admin-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title="Open Menu"
          >
            <MenuIcon size={20} />
          </button>
        )}
        <div>
          <h1
            style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              fontWeight: 600,
              color: 'var(--admin-text-primary)',
              fontFamily: 'var(--font-outfit), sans-serif',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h1>
          {subtitle && !isMobile && (
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--admin-text-secondary)',
                margin: '4px 0 0',
                fontFamily: 'var(--font-outfit), sans-serif',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick View Site Button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: isMobile ? '8px 10px' : '8px 16px',
            background: 'transparent',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            color: 'var(--admin-text-secondary)',
            fontSize: '0.75rem',
            textDecoration: 'none',
            fontFamily: 'var(--font-outfit), sans-serif',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--admin-hover-bg)';
            e.currentTarget.style.color = 'var(--admin-primary)';
            e.currentTarget.style.borderColor = 'var(--admin-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--admin-border)';
            e.currentTarget.style.color = 'var(--admin-text-secondary)';
          }}
          title="View Website"
        >
          <ExternalLink size={14} />
          {!isMobile && <span>View Website</span>}
        </a>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              padding: '8px',
              background: 'transparent',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              color: 'var(--admin-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--admin-hover-bg)';
              e.currentTarget.style.color = 'var(--admin-primary)';
              e.currentTarget.style.borderColor = 'var(--admin-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--admin-border)';
              e.currentTarget.style.color = 'var(--admin-text-secondary)';
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}

        {/* Admin Avatar */}
        {admin && (
          <Link
            href="/admin/profile"
            title="Edit Profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="hidden sm:block text-right">
              <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}>
                {admin.name}
              </span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit)' }}>
                Administrator
              </span>
            </div>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--admin-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: 'var(--font-outfit), sans-serif',
              }}
            >
              {admin.name.charAt(0).toUpperCase()}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
