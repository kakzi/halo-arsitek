'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminTopbar } from '@/features/admin';
import * as LucideIcons from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  isPublished: boolean;
  sortOrder: number;
}

const DynamicIcon = ({ name, size = 32 }: { name: string, size?: number }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComponent size={size} strokeWidth={1.5} />;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'Building', isPublished: false, sortOrder: 0 });

  const fetchData = () => {
    setIsLoading(true);
    fetch('/api/admin/services').then((r) => r.json()).then((d) => { setServices(d.data || []); setIsLoading(false); }).catch(() => setIsLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ title: '', description: '', icon: 'Building', isPublished: false, sortOrder: 0 }); setEditingId(null); setShowForm(false); };

  const handleEdit = (s: Service) => {
    setForm({ title: s.title, description: s.description, icon: s.icon, isPublished: s.isPublished, sortOrder: s.sortOrder });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { resetForm(); fetchData(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return;
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' };

  return (
    <>
      <AdminTopbar title="Services" subtitle="Kelola layanan studio" />
      <div className="p-4 md:p-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', margin: 0 }}>{services.length} layanan</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C8A97E, #A67C52)', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Tambah</button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', margin: '0 0 20px' }}>{editingId ? 'Edit' : 'Tambah'} Layanan</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Icon Name (Lucide)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--admin-hover-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                      <DynamicIcon name={form.icon} size={24} />
                    </div>
                    <input type="text" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} style={{ ...inputStyle, flex: 1 }} placeholder="Building" />
                  </div>
                </div>
                <div><label style={labelStyle}>Judul</label><input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}><label style={labelStyle}>Deskripsi</label><textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C8A97E, #A67C52)', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>{editingId ? 'Update' : 'Simpan'}</button>
                <button type="button" onClick={resetForm} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer' }}>Batal</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? [1, 2, 3, 4].map((i) => <div key={i} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', height: '160px' }} />) : services.length === 0 ? <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)', background: 'var(--admin-bg-card)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}><div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><DynamicIcon name="Box" size={48} /></div><p>Belum ada layanan</p></div> : services.map((s) => (
            <div key={s.id} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px', transition: 'all 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--admin-shadow)')}>
              <div style={{ marginBottom: '16px', color: '#C8A97E' }}>
                <DynamicIcon name={s.icon} />
              </div>
              <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', fontWeight: 600, margin: '0 0 8px', fontFamily: 'var(--font-outfit), sans-serif' }}>{s.title}</h3>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', margin: '0 0 16px', lineHeight: 1.5 }}>{s.description}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(s)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'var(--admin-hover-bg)', color: '#C8A97E', fontSize: '0.75rem', border: '1px solid var(--admin-border)', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.75rem', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
