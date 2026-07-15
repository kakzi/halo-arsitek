'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminTopbar } from '@/features/admin';
import { FolderTree } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function ProjectCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  const fetchData = () => {
    setIsLoading(true);
    fetch('/api/admin/project-categories').then((r) => r.json()).then((d) => { setCategories(d.data || []); setIsLoading(false); }).catch(() => setIsLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (name: string) => {
    setForm((p) => ({ ...p, name, slug: !editingId ? generateSlug(name) : p.slug }));
  };

  const resetForm = () => { setForm({ name: '', slug: '', description: '' }); setEditingId(null); setShowForm(false); };

  const handleEdit = (c: Category) => {
    setForm({ name: c.name, slug: c.slug, description: c.description || '' });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/project-categories/${editingId}` : '/api/admin/project-categories';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { resetForm(); fetchData(); } else {
      const err = await res.json();
      alert(err.error || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini?')) return;
    const res = await fetch(`/api/admin/project-categories/${id}`, { method: 'DELETE' });
    if (res.ok) { fetchData(); } else {
      const err = await res.json();
      alert(err.error || 'Terjadi kesalahan');
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' };

  return (
    <>
      <AdminTopbar title="Project Categories" subtitle="Kelola kategori proyek" />
      <div className="p-4 md:p-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', margin: 0 }}>{categories.length} kategori</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C8A97E, #A67C52)', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Tambah</button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', margin: '0 0 20px' }}>{editingId ? 'Edit' : 'Tambah'} Kategori</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div><label style={labelStyle}>Nama Kategori</label><input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
                <div><label style={labelStyle}>Slug</label><input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}><label style={labelStyle}>Deskripsi</label><textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C8A97E, #A67C52)', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>{editingId ? 'Update' : 'Simpan'}</button>
                <button type="button" onClick={resetForm} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer' }}>Batal</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? [1, 2, 3].map((i) => <div key={i} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', height: '140px' }} />) : categories.length === 0 ? <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)', background: 'var(--admin-bg-card)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}><div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><FolderTree size={48} /></div><p>Belum ada kategori</p></div> : categories.map((c) => (
            <div key={c.id} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px', transition: 'all 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--admin-shadow)')}>
              <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', fontWeight: 600, margin: '0 0 4px', fontFamily: 'var(--font-outfit), sans-serif' }}>{c.name}</h3>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.75rem', margin: '0 0 12px' }}>/{c.slug}</p>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', margin: '0 0 16px', lineHeight: 1.5, minHeight: '38px' }}>{c.description || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Tidak ada deskripsi</span>}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(c)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'var(--admin-hover-bg)', color: '#C8A97E', fontSize: '0.75rem', border: '1px solid var(--admin-border)', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(c.id)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.75rem', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
