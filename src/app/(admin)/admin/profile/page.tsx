'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminTopbar } from '@/features/admin';
import { useAuth } from '@/features/admin/context/auth-context';
import {
  User, Mail, Lock, Shield, Save, CheckCircle2, AlertCircle,
  Eye, EyeOff, Calendar, Clock, KeyRound, Check, X, ShieldCheck,
  Sparkles, Activity, Award
} from 'lucide-react';

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { refreshAuth } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

  // General form
  const [generalForm, setGeneralForm] = useState({ name: '', email: '' });
  const [generalLoading, setGeneralLoading] = useState(false);
  const [generalSuccess, setGeneralSuccess] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Password form
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/profile');
      if (res.ok) {
        const d = await res.json();
        setProfile(d.data);
        setGeneralForm({ name: d.data.name || '', email: d.data.email || '' });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Calculate password strength checks
  const pwdStrength = {
    length: pwdForm.newPassword.length >= 6,
    hasNumberOrSymbol: /[0-9!@#$%^&*(),.?":{}|<>]/g.test(pwdForm.newPassword),
    matches: pwdForm.newPassword.length > 0 && pwdForm.newPassword === pwdForm.confirmPassword,
  };
  const strengthCount = Object.values(pwdStrength).filter(Boolean).length;

  const handleGeneralSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralSuccess('');
    setGeneralError('');
    setGeneralLoading(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generalForm),
      });

      const d = await res.json();
      if (res.ok) {
        setGeneralSuccess('Personal information updated successfully.');
        setProfile((prev) => prev ? { ...prev, ...d.data } : null);
        if (refreshAuth) refreshAuth();
        setTimeout(() => setGeneralSuccess(''), 4000);
      } else {
        setGeneralError(d.error || 'Failed to update profile.');
      }
    } catch {
      setGeneralError('Network error occurred while saving profile.');
    } finally {
      setGeneralLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdError('New password and confirm password do not match.');
      return;
    }

    if (pwdForm.newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }

    setPwdLoading(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: pwdForm.currentPassword,
          newPassword: pwdForm.newPassword,
        }),
      });

      const d = await res.json();
      if (res.ok) {
        setPwdSuccess('Security password updated successfully.');
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPwdSuccess(''), 4000);
      } else {
        setPwdError(d.error || 'Failed to change password.');
      }
    } catch {
      setPwdError('Network error occurred while changing password.');
    } finally {
      setPwdLoading(false);
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

  if (isLoading) {
    return (
      <>
        <AdminTopbar title="Account Profile" subtitle="Manage your identity, role settings, and account security" />
        <div className="p-4 md:p-8">
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--admin-text-secondary)', background: 'var(--admin-bg-card)', borderRadius: '8px', border: 'none', boxShadow: 'var(--admin-shadow)' }}>
            <Activity className="animate-spin mx-auto mb-4" size={28} style={{ color: 'var(--admin-primary)' }} />
            <p style={{ margin: 0, fontSize: '0.9375rem', fontFamily: 'var(--font-outfit)' }}>Loading profile details...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Account Profile" subtitle="Manage your identity, role settings, and account security" />
      <div className="p-4 md:p-8 w-full">
        
        {/* Hero Profile Banner */}
        {profile && (
          <div
            style={{
              position: 'relative',
              background: 'var(--admin-bg-card)',
              border: 'none',
              borderRadius: '8px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: 'var(--admin-shadow)',
              overflow: 'hidden',
              color: 'var(--admin-text-primary)',
            }}
          >
            {/* Background glowing orb */}
            <div
              style={{
                position: 'absolute',
                top: '-40%',
                right: '-10%',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, rgba(99, 102, 241, 0) 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {/* Avatar Ring */}
              <div
                style={{
                  position: 'relative',
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-outfit), sans-serif',
                  boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.15), 0 10px 25px -5px rgba(99, 102, 241, 0.3)',
                  flexShrink: 0,
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '3px solid var(--admin-bg-card)',
                  }}
                  title="Status: Active"
                />
              </div>

              {/* Profile Details */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.625rem', fontWeight: 700, fontFamily: 'var(--font-outfit)', letterSpacing: '-0.02em', color: 'var(--admin-text-primary)' }}>
                    {profile.name}
                  </h2>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: profile.role === 'SUPER_ADMIN' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      border: profile.role === 'SUPER_ADMIN' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                      color: profile.role === 'SUPER_ADMIN' ? 'var(--admin-primary)' : '#10B981',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {profile.role === 'SUPER_ADMIN' ? <Award size={13} /> : <Shield size={13} />}
                    {profile.role}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-outfit)' }}>
                  <Mail size={15} style={{ color: 'var(--admin-primary)' }} /> {profile.email}
                </p>
              </div>

              {/* Account Quick Stats */}
              <div style={{ display: 'flex', gap: '20px', background: 'var(--admin-bg-page)', border: 'none', padding: '14px 20px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={12} /> Last Login
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}>
                    {profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'First time'}
                  </div>
                </div>
                <div style={{ width: '1px', background: 'var(--admin-border)' }} />
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={12} /> Member Since
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}>
                    {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'general' ? 'var(--admin-primary)' : 'transparent',
              color: activeTab === 'general' ? '#FFFFFF' : 'var(--admin-text-secondary)',
              border: activeTab === 'general' ? 'none' : '1px solid var(--admin-border)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-outfit), sans-serif',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <User size={16} /> Personal Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'security' ? 'var(--admin-primary)' : 'transparent',
              color: activeTab === 'security' ? '#FFFFFF' : 'var(--admin-text-secondary)',
              border: activeTab === 'security' ? 'none' : '1px solid var(--admin-border)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-outfit), sans-serif',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <KeyRound size={16} /> Password & Security
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form Area (Takes 2 columns) */}
          <div className="lg:col-span-2">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div
                style={{
                  background: 'var(--admin-bg-card)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '28px',
                  boxShadow: 'var(--admin-shadow)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '18px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}>
                      Personal Identity Information
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>
                      Update your display name and administrative contact email
                    </p>
                  </div>
                </div>

                {generalSuccess && (
                  <div style={{ padding: '14px 18px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#10B981', fontSize: '0.875rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} /> {generalSuccess}
                  </div>
                )}

                {generalError && (
                  <div style={{ padding: '14px 18px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#EF4444', fontSize: '0.875rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={18} /> {generalError}
                  </div>
                )}

                <form onSubmit={handleGeneralSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Full Display Name</label>
                    <input
                      type="text"
                      value={generalForm.name}
                      onChange={(e) => setGeneralForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                    />
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={labelStyle}>Primary Email Address</label>
                    <input
                      type="email"
                      value={generalForm.email}
                      onChange={(e) => setGeneralForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="admin@haloarsitek.com"
                      required
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                    />
                    <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                      This email is used for account login and receiving system notifications.
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={generalLoading}
                      style={{
                        padding: '12px 28px',
                        background: 'var(--admin-primary)',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: generalLoading ? 'wait' : 'pointer',
                        opacity: generalLoading ? 0.7 : 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                      }}
                    >
                      <Save size={16} /> {generalLoading ? 'Saving Changes...' : 'Save Personal Details'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div
                style={{
                  background: 'var(--admin-bg-card)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '28px',
                  boxShadow: 'var(--admin-shadow)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '18px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}>
                      Password & Account Security
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>
                      Ensure your account uses a strong password to protect administrative access
                    </p>
                  </div>
                </div>

                {pwdSuccess && (
                  <div style={{ padding: '14px 18px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#10B981', fontSize: '0.875rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} /> {pwdSuccess}
                  </div>
                )}

                {pwdError && (
                  <div style={{ padding: '14px 18px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#EF4444', fontSize: '0.875rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={18} /> {pwdError}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={pwdForm.currentPassword}
                        onChange={(e) => setPwdForm((p) => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="Enter your existing password"
                        required
                        style={{ ...inputStyle, paddingRight: '48px' }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
                      >
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label style={labelStyle}>New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={pwdForm.newPassword}
                          onChange={(e) => setPwdForm((p) => ({ ...p, newPassword: e.target.value }))}
                          placeholder="At least 6 characters"
                          required
                          minLength={6}
                          style={{ ...inputStyle, paddingRight: '48px' }}
                          onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}
                        >
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Confirm New Password</label>
                      <input
                        type="password"
                        value={pwdForm.confirmPassword}
                        onChange={(e) => setPwdForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="Repeat new password"
                        required
                        minLength={6}
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                      />
                    </div>
                  </div>

                  {/* Real-time Password Strength Check */}
                  {pwdForm.newPassword && (
                    <div style={{ background: 'var(--admin-bg-page)', padding: '16px', borderRadius: '10px', border: '1px solid var(--admin-border)', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>Security Strength</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: strengthCount === 3 ? '#10B981' : strengthCount === 2 ? '#F59E0B' : '#EF4444' }}>
                          {strengthCount === 3 ? 'Strong' : strengthCount === 2 ? 'Moderate' : 'Weak'}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--admin-border)', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }}>
                        <div
                          style={{
                            width: `${(strengthCount / 3) * 100}%`,
                            height: '100%',
                            background: strengthCount === 3 ? '#10B981' : strengthCount === 2 ? '#F59E0B' : '#EF4444',
                            transition: 'all 0.3s',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: pwdStrength.length ? '#10B981' : 'var(--admin-text-secondary)' }}>
                          {pwdStrength.length ? <Check size={14} /> : <X size={14} />} At least 6 characters in length
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: pwdStrength.hasNumberOrSymbol ? '#10B981' : 'var(--admin-text-secondary)' }}>
                          {pwdStrength.hasNumberOrSymbol ? <Check size={14} /> : <X size={14} />} Contains numbers or symbols (!@#$)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: pwdStrength.matches ? '#10B981' : 'var(--admin-text-secondary)' }}>
                          {pwdStrength.matches ? <Check size={14} /> : <X size={14} />} Passwords match correctly
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={pwdLoading}
                      style={{
                        padding: '12px 28px',
                        background: 'var(--admin-primary)',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: pwdLoading ? 'wait' : 'pointer',
                        opacity: pwdLoading ? 0.7 : 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                      }}
                    >
                      <Lock size={16} /> {pwdLoading ? 'Updating Password...' : 'Update Password Security'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Sidebar Widget (Role Info & Security Tips) */}
          <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Role Explanation Card */}
            <div
              style={{
                background: 'var(--admin-bg-card)',
                border: 'none',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: 'var(--admin-shadow)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <ShieldCheck size={20} style={{ color: 'var(--admin-primary)' }} />
                <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}>
                  Your Access Permissions
                </h4>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
                {profile?.role === 'SUPER_ADMIN' ? (
                  <>
                    You possess <strong style={{ color: 'var(--admin-text-primary)' }}>SUPER_ADMIN</strong> privileges. You have unrestricted right to manage system configurations, administrator accounts, and all architectural content modules across the studio CMS.
                  </>
                ) : (
                  <>
                    You possess <strong style={{ color: 'var(--admin-text-primary)' }}>ADMIN</strong> privileges. You can manage all portfolio projects, news articles, categories, team members, and client inquiries.
                  </>
                )}
              </p>
              <div style={{ padding: '12px', background: 'var(--admin-bg-page)', borderRadius: '10px', border: '1px solid var(--admin-border)', fontSize: '0.75rem', color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: '#F59E0B', flexShrink: 0 }} />
                <span>Need a role change? Contact the lead studio administrator.</span>
              </div>
            </div>

            {/* Security Guidelines Card */}
            <div
              style={{
                background: 'var(--admin-bg-card)',
                border: 'none',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: 'var(--admin-shadow)',
              }}
            >
              <h4 style={{ margin: '0 0 14px', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit)' }}>
                Security Best Practices
              </h4>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--admin-primary)', marginTop: '6px', flexShrink: 0 }} />
                  Never share your administrator account credentials with unauthorized personnel.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--admin-primary)', marginTop: '6px', flexShrink: 0 }} />
                  Use unique passwords containing uppercase, symbols, and numbers.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--admin-primary)', marginTop: '6px', flexShrink: 0 }} />
                  Always sign out when accessing the CMS from a shared device.
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
