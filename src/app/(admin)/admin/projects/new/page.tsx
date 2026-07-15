'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTopbar } from '@/features/admin';
import { Upload } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    categoryId: '',
    year: new Date().getFullYear(),
    location: '',
    area: '',
    description: '',
    coverImage: '',
    isPublished: false,
  });

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({ ...prev, title: value, slug: generateSlug(value) }));
  };

  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch('/api/admin/project-categories')
      .then(r => r.json())
      .then(d => {
        const cats = d.data || [];
        setCategories(cats);
        if (cats.length > 0 && !form.categoryId) {
          setForm(prev => ({ ...prev, categoryId: cats[0].id }));
        }
      });
  }, []);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, coverImage: data.data.url }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/projects');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal membuat project');
      }
    } catch {
      setError('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--admin-bg-card)',
    border: '1px solid var(--admin-border)',
    borderRadius: '8px',
    color: 'var(--admin-text-primary)',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-outfit), sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.6875rem',
    color: 'var(--admin-text-secondary)',
    fontFamily: 'var(--font-outfit), sans-serif',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  };

  return (
    <>
      <AdminTopbar title="Tambah Project Baru" subtitle="Buat portofolio proyek arsitektur baru" />

      <div className="p-4 md:p-8 max-w-4xl">
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '0.8125rem',
              color: '#EF4444',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className="p-5 md:p-8"
            style={{
              background: 'var(--admin-bg-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
            }}
          >
            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Judul Project</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Villa Bali Modern"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#C8A97E')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
              />
            </div>

            {/* Slug */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="villa-bali-modern"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#C8A97E')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
              />
              <p style={{ fontSize: '0.6875rem', color: '#3C3C3E', marginTop: '4px' }}>
                URL: /portofolio/{form.slug || '...'}
              </p>
            </div>

            {/* Category + Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label style={labelStyle}>Kategori</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  required
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tahun</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((prev) => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
                  min={1900}
                  max={2100}
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#C8A97E')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                />
              </div>
            </div>

            {/* Location + Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label style={labelStyle}>Lokasi</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Ubud, Bali"
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#C8A97E')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Luas Area</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
                  placeholder="450 m²"
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#C8A97E')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi detail tentang proyek arsitektur ini..."
                required
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => (e.target.style.borderColor = '#C8A97E')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
              />
            </div>

            {/* Cover Image */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Cover Image</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="URL gambar atau upload file"
                  required
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => (e.target.style.borderColor = '#C8A97E')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                />
                <label
                  style={{
                    padding: '12px 16px',
                    background: 'var(--admin-hover-bg)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    color: '#C8A97E',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Upload size={16} /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
              </div>
              {form.coverImage && (
                <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', maxWidth: '300px' }}>
                  <img
                    src={form.coverImage}
                    alt="Preview"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>

            {/* Published Toggle */}
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: form.isPublished ? '#C8A97E' : '#E5E7EB',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: form.isPublished ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#111827',
                    transition: 'left 0.2s',
                  }}
                />
              </button>
              <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>
                {form.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #C8A97E, #A67C52)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Project'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/projects')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  color: 'var(--admin-text-secondary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
