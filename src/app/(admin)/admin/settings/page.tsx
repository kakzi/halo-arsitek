'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminTopbar } from '@/features/admin';
import { Home, BookOpen, Phone, Globe, TrendingUp, Check, Save, Building2 } from 'lucide-react';
interface Setting { id: string; key: string; value: string; type: string; }

const defaultSettings = [
  { key: 'hero_tagline', label: 'Hero Tagline', placeholder: 'Creating Spaces, Building Stories' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', placeholder: 'Professional architecture studio...' },
  { key: 'about_description', label: 'About Description', placeholder: 'Studio philosophy and description' },
  { key: 'stat_years', label: 'Stat: Years of Experience', placeholder: '15' },
  { key: 'stat_projects', label: 'Stat: Completed Projects', placeholder: '200' },
  { key: 'stat_awards', label: 'Stat: Awards Won', placeholder: '50' },
  { key: 'stat_clients', label: 'Stat: Happy Clients', placeholder: '180' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'hello@haloarsitek.com' },
  { key: 'contact_phone', label: 'Contact Phone', placeholder: '+62 812 3456 7890' },
  { key: 'contact_whatsapp', label: 'WhatsApp Number', placeholder: '6281234567890' },
  { key: 'contact_address', label: 'Address', placeholder: 'Jl. Arsitektur No. 42, Jakarta' },
  { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/haloarsitek' },
  { key: 'social_linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/haloarsitek' },
  { key: 'google_analytics_id', label: 'Google Analytics ID (G-XXXX)', placeholder: 'G-XXXXXXXXXX' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, string> = {};
        if (d.data) {
          for (const s of d.data as Setting[]) {
            map[s.key] = s.value;
          }
        }
        setSettings(map);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    const settingsArray = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      type: ['stat_years', 'stat_projects', 'stat_awards', 'stat_clients'].includes(key) ? 'NUMBER' : 'STRING',
    }));

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' };

  return (
    <>
      <AdminTopbar title="Settings" subtitle="Configure website content and information" />
      <div className="p-4 md:p-8 w-full">
        {isLoading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-8">
              {/* ─── COLUMN 1 (Left) ─── */}
              <div className="flex flex-col gap-6">
                {/* Group: Hero Section */}
                <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-primary)', fontSize: '0.8125rem', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border)', fontWeight: 600 }}>
                    <Home size={16} /> Hero Section
                  </h3>
                  {defaultSettings.slice(0, 2).map((s) => (
                    <div key={s.key} style={{ marginBottom: '16px' }}>
                      <label style={labelStyle}>{s.label}</label>
                      <input type="text" value={settings[s.key] || ''} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
                    </div>
                  ))}
                </div>

                {/* Group: About */}
                <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-primary)', fontSize: '0.8125rem', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border)', fontWeight: 600 }}>
                    <BookOpen size={16} /> About Section
                  </h3>
                  <div>
                    <label style={labelStyle}>{defaultSettings[2].label}</label>
                    <textarea value={settings[defaultSettings[2].key] || ''} onChange={(e) => setSettings((p) => ({ ...p, [defaultSettings[2].key]: e.target.value }))} placeholder={defaultSettings[2].placeholder} rows={4} style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
                  </div>
                </div>

                {/* Group: Company Stats */}
                <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-primary)', fontSize: '0.8125rem', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border)', fontWeight: 600 }}>
                    <Building2 size={16} /> Company Stats & Numbers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {defaultSettings.slice(3, 7).map((s) => (
                      <div key={s.key}>
                        <label style={labelStyle}>{s.label}</label>
                        <input type="number" value={settings[s.key] || ''} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── COLUMN 2 (Right) ─── */}
              <div className="flex flex-col gap-6">
                {/* Group: Contact Info */}
                <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-primary)', fontSize: '0.8125rem', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border)', fontWeight: 600 }}>
                    <Phone size={16} /> Contact Information
                  </h3>
                  {defaultSettings.slice(7, 11).map((s) => (
                    <div key={s.key} style={{ marginBottom: '16px' }}>
                      <label style={labelStyle}>{s.label}</label>
                      <input type="text" value={settings[s.key] || ''} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
                    </div>
                  ))}
                </div>

                {/* Group: Social Media */}
                <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-primary)', fontSize: '0.8125rem', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border)', fontWeight: 600 }}>
                    <Globe size={16} /> Social Media Links
                  </h3>
                  {defaultSettings.slice(11, 13).map((s) => (
                    <div key={s.key} style={{ marginBottom: '16px' }}>
                      <label style={labelStyle}>{s.label}</label>
                      <input type="text" value={settings[s.key] || ''} onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
                    </div>
                  ))}
                </div>

                {/* Group: Analytics */}
                <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-primary)', fontSize: '0.8125rem', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border)', fontWeight: 600 }}>
                    <TrendingUp size={16} /> Analytics & SEO
                  </h3>
                  <div>
                    <label style={labelStyle}>{defaultSettings[13].label}</label>
                    <input type="text" value={settings[defaultSettings[13].key] || ''} onChange={(e) => setSettings((p) => ({ ...p, [defaultSettings[13].key]: e.target.value }))} placeholder={defaultSettings[13].placeholder} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button Bar */}
            <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', borderRadius: '12px', padding: '20px 24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>Save Changes</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--admin-text-secondary)' }}>Make sure to verify all fields before saving your configuration.</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {saved && <span style={{ color: '#10B981', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}><Check size={18} /> Saved successfully!</span>}
                <button type="submit" disabled={isSaving} style={{ padding: '12px 32px', background: 'var(--admin-primary)', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.6 : 1, transition: 'background 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-primary-hover)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--admin-primary)')}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save All Settings'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
