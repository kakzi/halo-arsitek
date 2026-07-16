'use client';

import { useEffect, useState } from 'react';
import { AdminTopbar } from '@/features/admin';
import {
  Building2, Mail, FileText,
  Eye, TrendingUp, ArrowUpRight, Clock, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  projects: { total: number; published: number };
  news: { total: number; published: number };
  testimonials: { total: number };
  services: { total: number };
  team: { total: number };
  contacts: { total: number; unread: number };
  categories: { projects: number; news: number };
  pageViews: { total: number; today: number };
  viewsChart: Array<{ label: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  recentContacts: Array<{
    id: string; name: string; email: string;
    message: string; status: string; createdAt: string;
  }>;
  recentProjects: Array<{
    id: string; title: string; isPublished: boolean;
    createdAt: string; category: { name: string };
  }>;
  recentNews: Array<{
    id: string; title: string; isPublished: boolean;
    createdAt: string; category: { name: string };
  }>;
}

const cardStyle: React.CSSProperties = {
  background: 'var(--admin-bg-card)',
  borderRadius: '8px',
  boxShadow: 'var(--admin-shadow)',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-outfit), sans-serif',
  fontSize: '1rem',
  color: 'var(--admin-text-primary)',
  fontWeight: 600,
  margin: '0 0 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.6875rem',
  color: 'var(--admin-text-secondary)',
  fontFamily: 'var(--font-outfit), sans-serif',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  margin: '0 0 8px',
};

const valueStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  color: 'var(--admin-text-primary)',
  fontFamily: 'var(--font-outfit), sans-serif',
  margin: 0,
  lineHeight: 1,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Projects', value: stats.projects.total, sub: `${stats.projects.published} published`, icon: <Building2 size={28} />, color: 'var(--admin-primary)' },
        { label: 'Total News', value: stats.news.total, sub: `${stats.news.published} published`, icon: <FileText size={28} />, color: '#60A5FA' },
        { label: 'Contacts', value: stats.contacts.total, sub: `${stats.contacts.unread} unread`, icon: <Mail size={28} />, color: '#F472B6' },
        { label: 'Page Views', value: stats.pageViews.total, sub: `${stats.pageViews.today} today`, icon: <Eye size={28} />, color: '#06B6D4' },
      ]
    : [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <>
      <AdminTopbar title="Dashboard" subtitle="Website content & activity overview" />

      <div className="p-4 md:p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...cardStyle, height: '120px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <>
            {/* ─── Stat Cards ─────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'default' }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'var(--admin-hover-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--admin-primary)', /* Or use card.color if preferred */
                      marginBottom: '16px',
                    }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p style={valueStyle}>{card.value}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <p style={labelStyle}>{card.label}</p>
                      {card.sub && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit), sans-serif', margin: 0 }}>
                          {card.sub}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Visitor Chart ──────────────────────── */}
            <div style={{ ...cardStyle, marginBottom: '32px', padding: '24px' }}>
              <h2 style={sectionTitleStyle}>
                <TrendingUp size={18} style={{ color: 'var(--admin-primary)' }} />
                Visitor Traffic (Last 7 Days)
              </h2>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.viewsChart || []} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      axisLine={false} tickLine={false}
                      tick={{ fill: 'var(--admin-text-secondary)', fontSize: 12, fontFamily: 'var(--font-outfit)' }}
                    />
                    <YAxis
                      axisLine={false} tickLine={false} allowDecimals={false}
                      tick={{ fill: 'var(--admin-text-secondary)', fontSize: 12, fontFamily: 'var(--font-outfit)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--admin-bg-card)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        fontFamily: 'var(--font-outfit)',
                        fontSize: '0.8125rem',
                        boxShadow: 'var(--admin-shadow)',
                      }}
                      labelStyle={{ color: 'var(--admin-text-primary)', fontWeight: 600 }}
                      itemStyle={{ color: 'var(--admin-primary)' }}
                    />
                    <Area
                      type="monotone" dataKey="count" name="Views"
                      stroke="var(--admin-primary)" strokeWidth={2.5}
                      fillOpacity={1} fill="url(#colorViews)"
                      dot={{ r: 4, fill: 'var(--admin-primary)', strokeWidth: 0 }}
                      activeDot={{ r: 6, stroke: 'var(--admin-bg-card)', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ─── Two‑Column Grid: Top Pages + Recent Contacts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

              {/* Top Pages */}
              <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid var(--admin-border)' }}>
                  <h2 style={{ ...sectionTitleStyle, margin: 0 }}>
                    <BarChart3 size={18} style={{ color: '#06B6D4' }} />
                    Popular Pages
                  </h2>
                </div>
                {stats?.topPages && stats.topPages.length > 0 ? (
                  stats.topPages.map((page, idx) => (
                    <div
                      key={page.path}
                      style={{
                        padding: '14px 24px',
                        borderBottom: idx < stats.topPages.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '6px',
                          background: `rgba(6, 182, 212, 0.1)`, color: '#06B6D4',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0,
                          fontFamily: 'var(--font-outfit)',
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{
                          fontSize: '0.8125rem', color: 'var(--admin-text-primary)',
                          fontFamily: 'var(--font-outfit)', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {page.path}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.75rem', color: 'var(--admin-text-secondary)',
                        fontFamily: 'var(--font-outfit)', fontWeight: 600, flexShrink: 0,
                      }}>
                        {page.count} views
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--admin-text-secondary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit)' }}>
                    No traffic data available
                  </div>
                )}
              </div>

              {/* Recent Contacts */}
              <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid var(--admin-border)' }}>
                  <h2 style={{ ...sectionTitleStyle, margin: 0 }}>
                    <Mail size={18} style={{ color: '#F472B6' }} />
                    Recent Messages
                  </h2>
                </div>
                {stats?.recentContacts && stats.recentContacts.length > 0 ? (
                  stats.recentContacts.map((contact, idx) => (
                    <div
                      key={contact.id}
                      style={{
                        padding: '14px 24px',
                        borderBottom: idx < stats.recentContacts.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: contact.status === 'UNREAD' ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                        flexShrink: 0, opacity: contact.status === 'UNREAD' ? 1 : 0.3,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-primary)', fontWeight: 500, fontFamily: 'var(--font-outfit)' }}>
                            {contact.name}
                          </span>
                          {contact.status === 'UNREAD' && (
                            <span style={{
                              fontSize: '0.5625rem', background: 'rgba(148, 163, 184, 0.15)',
                              color: 'var(--admin-primary)', padding: '1px 6px', borderRadius: '100px',
                              fontWeight: 600, fontFamily: 'var(--font-outfit)',
                            }}>
                              NEW
                            </span>
                          )}
                        </div>
                        <p style={{
                          fontSize: '0.75rem', color: 'var(--admin-text-secondary)', margin: 0,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          fontFamily: 'var(--font-outfit)',
                        }}>
                          {contact.message}
                        </p>
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', whiteSpace: 'nowrap', fontFamily: 'var(--font-outfit)' }}>
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--admin-text-secondary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit)' }}>
                    No incoming messages
                  </div>
                )}
              </div>
            </div>

            {/* ─── Two‑Column Grid: Recent Projects + Recent News ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Projects */}
              <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ ...sectionTitleStyle, margin: 0 }}>
                    <Building2 size={18} style={{ color: 'var(--admin-primary)' }} />
                    Recent Projects
                  </h2>
                  <a href="/admin/projects" style={{
                    fontSize: '0.75rem', color: 'var(--admin-primary)', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontFamily: 'var(--font-outfit)',
                  }}>
                    View All <ArrowUpRight size={14} />
                  </a>
                </div>
                {stats?.recentProjects && stats.recentProjects.length > 0 ? (
                  stats.recentProjects.map((project, idx) => (
                    <div
                      key={project.id}
                      style={{
                        padding: '14px 24px',
                        borderBottom: idx < stats.recentProjects.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-primary)', fontWeight: 500, margin: '0 0 2px', fontFamily: 'var(--font-outfit)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.title}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit)' }}>
                            {project.category.name}
                          </span>
                          <span style={{ fontSize: '0.5rem', color: 'var(--admin-text-secondary)' }}>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit)' }}>
                            <Clock size={10} /> {formatDate(project.createdAt)}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.5625rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 600,
                        fontFamily: 'var(--font-outfit)', flexShrink: 0,
                        background: project.isPublished ? 'rgba(52, 211, 153, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                        color: project.isPublished ? '#34D399' : 'var(--admin-text-secondary)',
                      }}>
                        {project.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--admin-text-secondary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit)' }}>
                    No projects found
                  </div>
                )}
              </div>

              {/* Recent News */}
              <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ ...sectionTitleStyle, margin: 0 }}>
                    <FileText size={18} style={{ color: '#60A5FA' }} />
                    Recent News
                  </h2>
                  <a href="/admin/news" style={{
                    fontSize: '0.75rem', color: 'var(--admin-primary)', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontFamily: 'var(--font-outfit)',
                  }}>
                    View All <ArrowUpRight size={14} />
                  </a>
                </div>
                {stats?.recentNews && stats.recentNews.length > 0 ? (
                  stats.recentNews.map((news, idx) => (
                    <div
                      key={news.id}
                      style={{
                        padding: '14px 24px',
                        borderBottom: idx < stats.recentNews.length - 1 ? '1px solid var(--admin-border)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-primary)', fontWeight: 500, margin: '0 0 2px', fontFamily: 'var(--font-outfit)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {news.title}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit)' }}>
                            {news.category.name}
                          </span>
                          <span style={{ fontSize: '0.5rem', color: 'var(--admin-text-secondary)' }}>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit)' }}>
                            <Clock size={10} /> {formatDate(news.createdAt)}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.5625rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 600,
                        fontFamily: 'var(--font-outfit)', flexShrink: 0,
                        background: news.isPublished ? 'rgba(52, 211, 153, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                        color: news.isPublished ? '#34D399' : 'var(--admin-text-secondary)',
                      }}>
                        {news.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--admin-text-secondary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit)' }}>
                    No news found
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
