'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminTopbar } from '@/features/admin';
import { FileText, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface News {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  category: Category;
  content: string;
  coverImage: string;
  isPublished: boolean;
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    categoryId: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop',
    isPublished: false,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [newsRes, catRes] = await Promise.all([
        fetch('/api/admin/news'),
        fetch('/api/admin/news-categories')
      ]);
      const newsData = await newsRes.json();
      const catData = await catRes.json();
      setNews(newsData.data || []);
      setCategories(catData.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm((p) => ({ ...p, title, slug: !editingId ? generateSlug(title) : p.slug }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop',
      isPublished: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (n: News) => {
    setForm({
      title: n.title,
      slug: n.slug,
      categoryId: n.categoryId,
      content: n.content,
      coverImage: n.coverImage,
      isPublished: n.isPublished,
    });
    setEditingId(n.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/news/${editingId}` : '/api/admin/news';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { resetForm(); fetchData(); } else {
      const err = await res.json();
      alert(err.error || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus berita ini?')) return;
    const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    if (res.ok) { fetchData(); } else {
      const err = await res.json();
      alert(err.error || 'Terjadi kesalahan');
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' };

  return (
    <>
      <AdminTopbar title="News" subtitle="Kelola artikel dan berita" />
      <div className="p-4 md:p-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', margin: 0 }}>{news.length} artikel</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C8A97E, #A67C52)', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Tambah</button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', margin: '0 0 20px' }}>{editingId ? 'Edit' : 'Tambah'} Berita</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label style={labelStyle}>Judul</label><input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
                <div><label style={labelStyle}>Slug</label><input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Kategori</label>
                  <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}>
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>
                <div><label style={labelStyle}>Cover Image URL</label><input type="url" value={form.coverImage} onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Status</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} />
                  <label htmlFor="isPublished" style={{ fontSize: '0.875rem', color: 'var(--admin-text-primary)' }}>Publikasikan</label>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}><label style={labelStyle}>Konten (HTML)</label><textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} required rows={8} style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => (e.target.style.borderColor = '#C8A97E')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C8A97E, #A67C52)', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>{editingId ? 'Update' : 'Simpan'}</button>
                <button type="button" onClick={resetForm} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer' }}>Batal</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? [1, 2, 3].map((i) => <div key={i} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', height: '300px' }} />) : news.length === 0 ? <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)', background: 'var(--admin-bg-card)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}><div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><FileText size={48} /></div><p>Belum ada berita</p></div> : news.map((n) => (
            <div key={n.id} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--admin-shadow)')}>
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <Image src={n.coverImage} alt={n.title} fill style={{ objectFit: 'cover' }} unoptimized />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: n.isPublished ? '#10B981' : '#F59E0B', color: '#fff', fontSize: '0.625rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
                  {n.isPublished ? 'Published' : 'Draft'}
                </div>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.6875rem', color: '#C8A97E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>{n.category.name}</span>
                <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1.125rem', fontWeight: 600, margin: '0 0 8px', fontFamily: 'var(--font-outfit), sans-serif', lineHeight: 1.3 }}>{n.title}</h3>
                <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.75rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {new Date(n.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                  <button onClick={() => handleEdit(n)} style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'var(--admin-hover-bg)', color: 'var(--admin-text-primary)', fontSize: '0.8125rem', border: '1px solid var(--admin-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(n.id)} style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.8125rem', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={14} /> Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
