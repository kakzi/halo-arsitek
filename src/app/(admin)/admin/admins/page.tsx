'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminTopbar } from '@/features/admin';
import { useAuth } from '@/features/admin/context/auth-context';
import {
  Users, Plus, Save, X, Edit2, Trash2, Shield, UserCheck,
  Lock, CheckCircle2, AlertCircle, Mail, Clock, Award,
  ShieldCheck, UserPlus, Sparkles, Activity
} from 'lucide-react';

interface AdminAccount {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function ManageAdminsPage() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN' as 'SUPER_ADMIN' | 'ADMIN',
    isActive: true,
  });

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/admins');
      if (res.ok) {
        const d = await res.json();
        setAdmins(d.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (adm: AdminAccount) => {
    setForm({
      name: adm.name,
      email: adm.email,
      password: '', // leave blank unless changing
      role: adm.role,
      isActive: adm.isActive,
    });
    setEditingId(adm.id);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const url = editingId ? `/api/admin/admins/${editingId}` : '/api/admin/admins';
    const method = editingId ? 'PUT' : 'POST';

    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      role: form.role,
      isActive: form.isActive,
    };

    if (editingId) {
      if (form.password && form.password.trim().length >= 6) {
        payload.password = form.password.trim();
      }
    } else {
      payload.password = form.password;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (res.ok) {
        setSuccess(d.message || (editingId ? 'Administrator account updated successfully' : 'Administrator account created successfully'));
        resetForm();
        fetchAdmins();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(d.error || 'Operation failed');
      }
    } catch {
      setError('Network error occurred during submission.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete administrator "${name}"? This action cannot be undone.`)) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' });
      const d = await res.json();
      if (res.ok) {
        setSuccess(d.message || 'Administrator account deleted');
        fetchAdmins();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        alert(d.error || 'Failed to delete account');
      }
    } catch {
      alert('Network error occurred while deleting.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--admin-bg-page)',
    border: '1px solid var(--admin-border)',
    borderRadius: '10px',
    color: 'var(--admin-text-primary)',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-outfit), sans-serif',
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--admin-text-secondary)',
    fontFamily: 'var(--font-outfit), sans-serif',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
    fontWeight: 600,
  };

  if (currentAdmin && currentAdmin.role !== 'SUPER_ADMIN') {
    return (
      <>
        <AdminTopbar title="Access Restricted" subtitle="Role verification required" />
        <div className="p-4 md:p-8">
          <div
            style={{
              background: 'var(--admin-bg-card)',
              border: 'none',
              borderRadius: '8px',
              padding: '56px 28px',
              textAlign: 'center',
              boxShadow: 'var(--admin-shadow)',
              maxWidth: '580px',
              margin: '40px auto',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <AlertCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-text-primary)', margin: '0 0 12px', fontFamily: 'var(--font-outfit)' }}>
              Insufficient Role Access
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--admin-text-secondary)', margin: '0 0 28px', lineHeight: 1.6 }}>
              Only administrators with the <strong style={{ color: '#6366F1' }}>SUPER_ADMIN</strong> role have permission to view, add, and manage user credentials across the studio. Your current role is <strong style={{ color: '#10B981' }}>{currentAdmin.role}</strong>.
            </p>
            <a
              href="/admin"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'var(--admin-primary)',
                color: '#FFFFFF',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              }}
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </>
    );
  }

  // Calculate quick stats
  const totalAdmins = admins.length;
  const superAdminsCount = admins.filter(a => a.role === 'SUPER_ADMIN').length;
  const activeAdminsCount = admins.filter(a => a.isActive).length;

  return (
    <>
      <AdminTopbar title="Manage Admins" subtitle="View and manage studio administrator credentials, roles, and access levels" />
      <div className="p-4 md:p-8" style={{ maxWidth: '1200px' }}>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div style={{ background: 'var(--admin-bg-card)', border: 'none', borderRadius: '8px', padding: '20px 24px', boxShadow: 'var(--admin-shadow)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Administrators</div>
              <div style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)', lineHeight: 1.2 }}>{totalAdmins}</div>
            </div>
          </div>

          <div style={{ background: 'var(--admin-bg-card)', border: 'none', borderRadius: '8px', padding: '20px 24px', boxShadow: 'var(--admin-shadow)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Super Admins</div>
              <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#6366F1', fontFamily: 'var(--font-outfit)', lineHeight: 1.2 }}>{superAdminsCount}</div>
            </div>
          </div>

          <div style={{ background: 'var(--admin-bg-card)', border: 'none', borderRadius: '8px', padding: '20px 24px', boxShadow: 'var(--admin-shadow)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Accounts</div>
              <div style={{ fontSize: '1.625rem', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-outfit)', lineHeight: 1.2 }}>{activeAdminsCount}</div>
            </div>
          </div>
        </div>

        {/* Top Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}>
              Administrator Directory
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>
              Manage access rights, status, and role configurations for studio staff
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm && !editingId) {
                setShowForm(false);
              } else {
                resetForm();
                setShowForm(true);
              }
            }}
            style={{
              padding: '12px 24px',
              background: showForm && !editingId ? 'var(--admin-bg-page)' : 'var(--admin-primary)',
              color: showForm && !editingId ? 'var(--admin-text-primary)' : '#FFFFFF',
              border: showForm && !editingId ? '1px solid var(--admin-border)' : 'none',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: showForm && !editingId ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.25)',
              transition: 'all 0.2s',
            }}
          >
            {showForm && !editingId ? <X size={16} /> : <UserPlus size={16} />}
            {showForm && !editingId ? 'Cancel Creation' : 'Add New Administrator'}
          </button>
        </div>

        {success && (
          <div style={{ padding: '14px 18px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#10B981', fontSize: '0.875rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        {error && !showForm && (
          <div style={{ padding: '14px 18px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#EF4444', fontSize: '0.875rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Interactive Form Box */}
        {showForm && (
          <div
            style={{
              background: 'var(--admin-bg-card)',
              boxShadow: 'var(--admin-shadow)',
              border: 'none',
              borderRadius: '8px',
              padding: '28px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1.125rem', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', margin: 0 }}>
                    {editingId ? 'Edit Administrator Credentials' : 'Create New Administrator Account'}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>
                    {editingId ? 'Update personal details, assign role access, or reset account password' : 'Assign display name, email login, and security role level'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-secondary)', cursor: 'pointer', padding: '6px' }}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#EF4444', fontSize: '0.8125rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label style={labelStyle}>Full Display Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Lead Architect Admin"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address (Login ID)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="admin@haloarsitek.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label style={labelStyle}>{editingId ? 'Password (Leave blank to keep existing)' : 'Account Password'}</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder={editingId ? '••••••••' : 'Minimum 6 characters'}
                    required={!editingId}
                    minLength={editingId ? 0 : 6}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Account Status</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setForm((p) => ({ ...p, isActive: true }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: form.isActive ? '2px solid #10B981' : '1px solid var(--admin-border)',
                        background: form.isActive ? 'rgba(16, 185, 129, 0.08)' : 'var(--admin-bg-page)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit)' }}>
                        <CheckCircle2 size={18} style={{ color: '#10B981' }} /> Active
                      </div>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: form.isActive ? '5px solid #10B981' : '2px solid var(--admin-border)' }} />
                    </div>

                    <div
                      onClick={() => setForm((p) => ({ ...p, isActive: false }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: !form.isActive ? '2px solid #EF4444' : '1px solid var(--admin-border)',
                        background: !form.isActive ? 'rgba(239, 68, 68, 0.08)' : 'var(--admin-bg-page)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit)' }}>
                        <AlertCircle size={18} style={{ color: '#EF4444' }} /> Suspended
                      </div>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: !form.isActive ? '5px solid #EF4444' : '2px solid var(--admin-border)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Selection Cards */}
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Access Role Assignment</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div
                    onClick={() => setForm((p) => ({ ...p, role: 'ADMIN' }))}
                    style={{
                      padding: '18px',
                      borderRadius: '12px',
                      border: form.role === 'ADMIN' ? '2px solid #10B981' : '1px solid var(--admin-border)',
                      background: form.role === 'ADMIN' ? 'rgba(16, 185, 129, 0.06)' : 'var(--admin-bg-page)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--admin-text-primary)', fontSize: '0.9375rem', fontFamily: 'var(--font-outfit)' }}>
                        <Shield size={18} style={{ color: '#10B981' }} /> ADMIN
                      </div>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: form.role === 'ADMIN' ? '5px solid #10B981' : '2px solid var(--admin-border)' }} />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--admin-text-secondary)', lineHeight: 1.5 }}>
                      Can manage portfolio projects, news, categories, team members, and view studio client messages.
                    </p>
                  </div>

                  <div
                    onClick={() => setForm((p) => ({ ...p, role: 'SUPER_ADMIN' }))}
                    style={{
                      padding: '18px',
                      borderRadius: '12px',
                      border: form.role === 'SUPER_ADMIN' ? '2px solid #6366F1' : '1px solid var(--admin-border)',
                      background: form.role === 'SUPER_ADMIN' ? 'rgba(99, 102, 241, 0.08)' : 'var(--admin-bg-page)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--admin-text-primary)', fontSize: '0.9375rem', fontFamily: 'var(--font-outfit)' }}>
                        <Award size={18} style={{ color: '#6366F1' }} /> SUPER_ADMIN
                      </div>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: form.role === 'SUPER_ADMIN' ? '5px solid #6366F1' : '2px solid var(--admin-border)' }} />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--admin-text-secondary)', lineHeight: 1.5 }}>
                      Full administrative authority. Can create/delete administrator accounts and change core settings.
                    </p>
                  </div>

                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--admin-border)', paddingTop: '20px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '10px',
                    color: 'var(--admin-text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 28px',
                    background: 'var(--admin-primary)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                  }}
                >
                  <Save size={16} /> {editingId ? 'Save Credentials' : 'Create Administrator'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admins Table Card */}
        {isLoading ? (
          <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--admin-text-secondary)', background: 'var(--admin-bg-card)', borderRadius: '8px', border: 'none', boxShadow: 'var(--admin-shadow)' }}>
            <Activity className="animate-spin mx-auto mb-4" size={28} style={{ color: 'var(--admin-primary)' }} />
            <p style={{ margin: 0, fontSize: '0.9375rem', fontFamily: 'var(--font-outfit)' }}>Loading administrator directory...</p>
          </div>
        ) : (
          <div
            style={{
              background: 'var(--admin-bg-card)',
              borderRadius: '8px',
              border: 'none',
              overflow: 'hidden',
              boxShadow: 'var(--admin-shadow)',
            }}
          >
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-bg-page)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-outfit)' }}>Administrator</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-outfit)' }}>Access Role</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-outfit)' }}>Account Status</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-outfit)' }}>Last Login</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-outfit)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((adm, index) => {
                    const isSelf = currentAdmin?.id === adm.id;
                    return (
                      <tr
                        key={adm.id}
                        style={{
                          borderBottom: index === admins.length - 1 ? 'none' : '1px solid var(--admin-border)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '18px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div
                              style={{
                                position: 'relative',
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: '1rem',
                                fontFamily: 'var(--font-outfit)',
                                flexShrink: 0,
                              }}
                            >
                              {adm.name.charAt(0).toUpperCase()}
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: '1px',
                                  right: '1px',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: adm.isActive ? '#10B981' : '#EF4444',
                                  border: '2px solid var(--admin-bg-card)',
                                }}
                                title={adm.isActive ? 'Active' : 'Suspended'}
                              />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-outfit)' }}>
                                {adm.name}
                                {isSelf && (
                                  <span style={{ fontSize: '0.6875rem', padding: '2px 8px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366F1', borderRadius: '999px', fontWeight: 600 }}>
                                    You (Current)
                                  </span>
                                )}
                              </div>
                              <div style={{ color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                                <Mail size={13} style={{ color: 'var(--admin-primary)' }} /> {adm.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '18px 24px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: adm.role === 'SUPER_ADMIN' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              border: adm.role === 'SUPER_ADMIN' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                              color: adm.role === 'SUPER_ADMIN' ? '#6366F1' : '#10B981',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {adm.role === 'SUPER_ADMIN' ? <Award size={14} /> : <Shield size={14} />}
                            {adm.role}
                          </span>
                        </td>

                        <td style={{ padding: '18px 24px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: adm.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: adm.isActive ? '#10B981' : '#EF4444',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                            {adm.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        <td style={{ padding: '18px 24px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} />
                            {adm.lastLoginAt ? new Date(adm.lastLoginAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
                          </div>
                        </td>

                        <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => handleEdit(adm)}
                              title="Edit credentials & role"
                              style={{
                                padding: '8px 12px',
                                background: 'transparent',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '8px',
                                color: 'var(--admin-text-primary)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--admin-hover-bg)';
                                e.currentTarget.style.borderColor = 'var(--admin-primary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'var(--admin-border)';
                              }}
                            >
                              <Edit2 size={14} /> Edit
                            </button>

                            {!isSelf && (
                              <button
                                onClick={() => handleDelete(adm.id, adm.name)}
                                title="Delete administrator account"
                                style={{
                                  padding: '8px 12px',
                                  background: 'transparent',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  borderRadius: '8px',
                                  color: '#EF4444',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontSize: '0.8125rem',
                                  fontWeight: 500,
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
