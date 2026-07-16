'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminTopbar } from '@/features/admin';
import { Upload, Users } from 'lucide-react';

interface TeamMember { id: string; name: string; role: string; image: string; isPublished: boolean; sortOrder: number; }

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '', image: '', isPublished: false });

  const fetchData = () => { setIsLoading(true); fetch('/api/admin/team').then((r) => r.json()).then((d) => { setMembers(d.data || []); setIsLoading(false); }).catch(() => setIsLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ name: '', role: '', image: '', isPublished: false }); setEditingId(null); setShowForm(false); };

  const handleEdit = (m: TeamMember) => { setForm({ name: m.name, role: m.role, image: m.image, isPublished: m.isPublished }); setEditingId(m.id); setShowForm(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/team/${editingId}` : '/api/admin/team';
    const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { resetForm(); fetchData(); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Hapus anggota tim ini?')) return; await fetch(`/api/admin/team/${id}`, { method: 'DELETE' }); fetchData(); };

  const handleImageUpload = async (file: File) => {
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (res.ok) { const data = await res.json(); setForm((p) => ({ ...p, image: data.data.url })); }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' };

  return (
    <>
      <AdminTopbar title="Team" subtitle="Kelola anggota tim" />
      <div className="p-4 md:p-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', margin: 0 }}>{members.length} member(s)</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C8A97E, #A67C52)', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Tambah</button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', margin: '0 0 20px' }}>{editingId ? 'Edit' : 'Tambah'} Anggota Tim</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div><label style={labelStyle}>Nama</label><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
                <div><label style={labelStyle}>Role / Jabatan</label><input type="text" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Foto</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} required style={{ ...inputStyle, flex: 1 }} placeholder="URL foto atau upload" onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
                  <label style={{ padding: '12px 16px', background: 'var(--admin-hover-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: '#C8A97E', fontSize: '0.8125rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}><Upload size={16} /> Upload<input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} /></label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C8A97E, #A67C52)', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>{editingId ? 'Update' : 'Simpan'}</button>
                <button type="button" onClick={resetForm} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer' }}>Batal</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? [1, 2, 3].map((i) => <div key={i} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', height: '200px' }} />) : members.length === 0 ? <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)', background: 'var(--admin-bg-card)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}><div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><Users size={48} /></div><p>Belum ada anggota tim</p></div> : members.map((m) => (
            <div key={m.id} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--admin-shadow)')}>
              <div style={{ width: '100%', height: '180px', background: 'var(--admin-hover-bg)', overflow: 'hidden' }}>
                <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div style={{ padding: '16px' }}>
                <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 4px', fontFamily: 'var(--font-outfit), sans-serif' }}>{m.name}</h3>
                <p style={{ color: '#C8A97E', fontSize: '0.75rem', margin: '0 0 12px' }}>{m.role}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(m)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'var(--admin-hover-bg)', color: '#C8A97E', fontSize: '0.75rem', border: '1px solid var(--admin-border)', cursor: 'pointer', flex: 1 }}>Edit</button>
                  <button onClick={() => handleDelete(m.id)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.75rem', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
