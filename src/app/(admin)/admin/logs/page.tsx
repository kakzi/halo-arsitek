'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminTopbar } from '@/features/admin';
import { History, Search, Shield, Award, Calendar, User, Activity, CheckCircle2, AlertTriangle, Trash2, Edit2, PlusCircle } from 'lucide-react';

interface ActivityLogItem {
  id: string;
  action: string;
  details: string | null;
  adminName: string;
  adminRole: string;
  ipAddress: string | null;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async (currentPage = 1, searchQuery = '') => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: '30',
        search: searchQuery,
      });
      const res = await fetch(`/api/admin/logs?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchLogs(1, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchLogs]);

  const getActionBadge = (action: string) => {
    const upper = action.toUpperCase();
    if (upper.includes('CREATE') || upper.includes('ADD') || upper.includes('NEW')) {
      return {
        bg: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        color: '#10B981',
        icon: <PlusCircle size={14} />,
      };
    }
    if (upper.includes('DELETE') || upper.includes('REMOVE') || upper.includes('DESTROY')) {
      return {
        bg: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#EF4444',
        icon: <Trash2 size={14} />,
      };
    }
    if (upper.includes('UPDATE') || upper.includes('EDIT') || upper.includes('MODIFY')) {
      return {
        bg: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        color: 'var(--admin-primary)',
        icon: <Edit2 size={14} />,
      };
    }
    return {
      bg: 'var(--admin-hover-bg)',
      border: '1px solid var(--admin-border)',
      color: 'var(--admin-text-primary)',
      icon: <History size={14} />,
    };
  };

  return (
    <>
      <AdminTopbar
        title="Audit Activity Logs"
        subtitle="Track system actions, security events, and data modifications across the platform"
      />

      <div className="p-4 md:p-8 w-full">
        {/* Top Search Bar Card */}
        <div
          style={{
            background: 'var(--admin-bg-card)',
            boxShadow: 'var(--admin-shadow)',
            border: 'none',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--admin-text-secondary)',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, details, or admin name..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                background: 'var(--admin-bg-page)',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                color: 'var(--admin-text-primary)',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-outfit)',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem' }}>
            <Activity size={16} style={{ color: 'var(--admin-primary)' }} /> Showing real-time system audit logs
          </div>
        </div>

        {/* Logs Table Card */}
        <div
          style={{
            background: 'var(--admin-bg-card)',
            boxShadow: 'var(--admin-shadow)',
            border: 'none',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              <Activity className="animate-spin mx-auto mb-4" size={28} style={{ color: 'var(--admin-primary)' }} />
              <p style={{ margin: 0, fontSize: '0.9375rem', fontFamily: 'var(--font-outfit)' }}>Loading audit trail history...</p>
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              <History size={48} className="mx-auto mb-4" style={{ opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>No activity logs recorded yet</p>
              <p style={{ margin: '6px 0 0', fontSize: '0.875rem' }}>System events will appear here as administrators perform actions.</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-outfit)' }}>
                  <thead>
                    <tr style={{ background: 'var(--admin-bg-page)', borderBottom: '1px solid var(--admin-border)', fontSize: '0.75rem', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Action Event</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Description Details</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Performed By</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>IP Address</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => {
                      const badge = getActionBadge(log.action);
                      return (
                        <tr
                          key={log.id}
                          style={{
                            borderBottom: idx === logs.length - 1 ? 'none' : '1px solid var(--admin-border)',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: badge.bg,
                                border: badge.border,
                                color: badge.color,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              {badge.icon}
                              {log.action}
                            </span>
                          </td>

                          <td style={{ padding: '16px 24px', color: 'var(--admin-text-primary)', fontSize: '0.875rem', maxWidth: '360px' }}>
                            {log.details || '—'}
                          </td>

                          <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                  color: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.8125rem',
                                  fontWeight: 700,
                                }}
                              >
                                {log.adminName ? log.adminName.charAt(0).toUpperCase() : 'S'}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>{log.adminName}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                                  {log.adminRole === 'SUPER_ADMIN' ? <Award size={11} style={{ color: 'var(--admin-primary)' }} /> : <Shield size={11} style={{ color: '#10B981' }} />}
                                  {log.adminRole}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '16px 24px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                            {log.ipAddress || 'Internal'}
                          </td>

                          <td style={{ padding: '16px 24px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={13} />
                              {new Date(log.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Card Footer */}
              {totalPages > 1 && (
                <div
                  style={{
                    padding: '16px 24px',
                    borderTop: '1px solid var(--admin-border)',
                    background: 'var(--admin-bg-page)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>
                    Page <strong style={{ color: 'var(--admin-text-primary)' }}>{page}</strong> of <strong style={{ color: 'var(--admin-text-primary)' }}>{totalPages}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const next = Math.max(1, page - 1);
                        setPage(next);
                        fetchLogs(next, search);
                      }}
                      disabled={page === 1}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: '1px solid var(--admin-border)',
                        background: page === 1 ? 'transparent' : 'var(--admin-bg-card)',
                        color: page === 1 ? 'var(--admin-text-secondary)' : 'var(--admin-text-primary)',
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.8125rem',
                        opacity: page === 1 ? 0.5 : 1,
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        const next = Math.min(totalPages, page + 1);
                        setPage(next);
                        fetchLogs(next, search);
                      }}
                      disabled={page === totalPages}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: '1px solid var(--admin-border)',
                        background: page === totalPages ? 'transparent' : 'var(--admin-bg-card)',
                        color: page === totalPages ? 'var(--admin-text-secondary)' : 'var(--admin-text-primary)',
                        cursor: page === totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '0.8125rem',
                        opacity: page === totalPages ? 0.5 : 1,
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
