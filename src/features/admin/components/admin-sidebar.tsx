'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/auth-context';
import { useAdminUI } from '../context/admin-ui-context';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Wrench,
  Users,
  Settings,
  Mail,
  LogOut,
  Menu,
  ChevronLeft,
  FolderTree,
  FileText,
  BarChart3,
  Shield,
  UserCog,
  History,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  allowedRoles?: string[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    ]
  },
  {
    title: 'Content',
    items: [
      { label: 'Projects', href: '/admin/projects', icon: <Building2 size={20} /> },
      { label: 'Project Categories', href: '/admin/project-categories', icon: <FolderTree size={20} /> },
      { label: 'News', href: '/admin/news', icon: <FileText size={20} /> },
      { label: 'News Categories', href: '/admin/news-categories', icon: <FolderTree size={20} /> },
    ]
  },
  {
    title: 'Company',
    items: [
      { label: 'Services', href: '/admin/services', icon: <Wrench size={20} /> },
      { label: 'Team', href: '/admin/team', icon: <Users size={20} /> },
      { label: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquare size={20} /> },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Contacts', href: '/admin/contacts', icon: <Mail size={20} /> },
      { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={20} /> },
      { label: 'Audit Logs', href: '/admin/logs', icon: <History size={20} /> },
      { label: 'Manage Admins', href: '/admin/admins', icon: <Shield size={20} />, allowedRoles: ['SUPER_ADMIN'] },
      { label: 'Edit Profile', href: '/admin/profile', icon: <UserCog size={20} /> },
      { label: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const { isMobile, isMobileSidebarOpen, setIsMobileSidebarOpen } = useAdminUI();
  const [collapsedState, setCollapsed] = useState(false);
  const collapsed = collapsedState && !isMobile;
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    if (pathname === href) return true;
    if (pathname.startsWith(href + '/')) return true;
    return false;
  };

  const isDark = mounted && theme === 'dark';
  const sidebarBg = isDark ? '#1C2434' : '#FFFFFF';
  const sidebarBorder = isDark ? '#2E3A47' : '#E2E8F0';
  const sidebarText = isDark ? '#DEE4EE' : '#1C2434';
  const sidebarTextMuted = isDark ? '#8A99AF' : '#64748B';
  const sidebarHover = isDark ? '#333A48' : '#F1F5F9';
  const sidebarActive = isDark ? '#333A48' : '#EEF2FF';

  return (
    <aside
      className={`admin-sidebar ${collapsed && !isMobile ? 'admin-sidebar--collapsed' : ''}`}
      style={{
        width: isMobile ? '260px' : collapsed ? '72px' : '260px',
        height: '100vh',
        background: sidebarBg,
        borderRight: `1px solid ${sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        overflow: 'hidden',
        transform: isMobile ? (isMobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '0 16px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <Image 
              src={mounted && theme === 'dark' ? '/logo/logo-halo-arsitek-white.png' : '/logo/logo-halo-arsitek-black.png'}
              alt="HaloArsitek Logo" 
              width={32} 
              height={32} 
              style={{ objectFit: 'contain' }}
              priority
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--admin-sidebar-text)',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  lineHeight: '1.2'
                }}
              >
                HALOARSITEK
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--admin-text-secondary)',
                  letterSpacing: '0.02em',
                  textTransform: 'none',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  lineHeight: '1.2',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '170px',
                  display: 'block',
                  marginTop: '2px',
                  fontWeight: 500,
                }}
                title={admin?.email || 'Admin CMS'}
              >
                {admin?.email || 'Admin CMS'}
              </span>
            </div>
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: sidebarTextMuted,
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: '4px',
              borderRadius: '6px',
              transition: 'color 0.2s, background 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = sidebarText;
              e.currentTarget.style.background = sidebarHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = sidebarTextMuted;
              e.currentTarget.style.background = 'none';
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navGroups.map((group, idx) => {
          const visibleItems = group.items.filter(
            (item) => !item.allowedRoles || (admin && item.allowedRoles.includes(admin.role))
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} style={{ marginBottom: idx === navGroups.length - 1 ? '0' : '16px' }}>
              {!collapsed && (
                <div
                  style={{
                    padding: '0 16px',
                    marginBottom: '12px',
                    marginTop: '16px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: sidebarTextMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: 'var(--font-outfit), sans-serif',
                  }}
                >
                  {group.title}
                </div>
              )}
              {visibleItems.map((item) => {
                const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { if (isMobile) setIsMobileSidebarOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? '0' : '12px',
                    padding: collapsed ? '12px 16px' : '10px 16px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: active ? 'var(--admin-primary)' : sidebarTextMuted,
                    background: active ? sidebarActive : 'transparent',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: active ? 600 : 400,
                    transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    marginBottom: '4px',
                    position: 'relative',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = sidebarText;
                      e.currentTarget.style.background = sidebarHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = sidebarTextMuted;
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {/* TailAdmin active indicator */}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: 'var(--admin-primary)',
                        borderTopRightRadius: '3px',
                        borderBottomRightRadius: '3px',
                      }}
                    />
                  )}
                  <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Section / Logout */}
      <div
        style={{
          padding: collapsed ? '16px 8px' : '16px 24px',
          borderTop: `1px solid ${sidebarBorder}`,
        }}
      >
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '6px',
            color: '#EF4444',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-outfit), sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
