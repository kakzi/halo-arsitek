'use client';

import { useState, useEffect, type FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTopbar, MarkdownEditor } from '@/features/admin';
import { Upload, Save, X, Plus, Trash2, ArrowLeft, ArrowRight, Star } from 'lucide-react';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    images: [] as string[],
    isPublished: false,
    isHeadliner: false,
  });
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch('/api/admin/project-categories')
      .then(r => r.json())
      .then(d => setCategories(d.data || []));

    fetch(`/api/admin/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setForm({
            title: data.data.title,
            slug: data.data.slug,
            categoryId: data.data.categoryId,
            year: data.data.year,
            location: data.data.location,
            area: data.data.area,
            description: data.data.description,
            coverImage: data.data.coverImage,
            images: Array.isArray(data.data.images) ? data.data.images : [],
            isPublished: data.data.isPublished,
            isHeadliner: data.data.isHeadliner ?? false,
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, coverImage: data.data.url }));
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    setIsUploadingGallery(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.url) uploadedUrls.push(data.data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      }
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const addGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setForm((prev) => ({ ...prev, images: [...prev.images, newGalleryUrl.trim()] }));
      setNewGalleryUrl('');
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const moveGalleryImage = (fromIdx: number, direction: 'left' | 'right') => {
    setForm((prev) => {
      const toIdx = direction === 'left' ? fromIdx - 1 : fromIdx + 1;
      if (toIdx < 0 || toIdx >= prev.images.length) return prev;
      const newImages = [...prev.images];
      const temp = newImages[fromIdx];
      newImages[fromIdx] = newImages[toIdx];
      newImages[toIdx] = temp;
      return { ...prev, images: newImages };
    });
  };

  const setAsCover = (imgUrl: string) => {
    setForm((prev) => ({ ...prev, coverImage: imgUrl }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/projects');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update project');
      }
    } catch {
      setError('An error occurred');
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

  if (isLoading) {
    return (
      <>
        <AdminTopbar title="Edit Project" />
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Edit Project" subtitle={form.title} />

      <div className="p-4 md:p-8 w-full">
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', fontSize: '0.8125rem', color: '#EF4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="p-5 md:p-8" style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Project Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Slug (URL)</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label style={labelStyle}>Category</label>
                <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }} required>
                  <option value="" disabled>Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: parseInt(e.target.value) || 0 }))} min={1900} max={2100} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label style={labelStyle}>Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
              </div>
              <div>
                <label style={labelStyle}>Area</label>
                <input type="text" value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
              </div>
            </div>

            <MarkdownEditor
              value={form.description}
              onChange={(val) => setForm((p) => ({ ...p, description: val }))}
              label="Description"
              required
              rows={6}
            />

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Cover Image</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="text" value={form.coverImage} onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))} required style={{ ...inputStyle, flex: 1 }} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} />
                <label style={{ padding: '12px 16px', background: 'var(--admin-hover-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-primary)', fontSize: '0.8125rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={16} /> Upload
                  <input type="file" accept="image/*" hidden onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }} />
                </label>
              </div>
              {form.coverImage && (
                <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', maxWidth: '300px' }}>
                  <img src={form.coverImage} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            {/* Project Gallery Images (Multiple) */}
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Project Gallery Images (Multiple)</label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <label
                  style={{
                    padding: '12px 16px',
                    background: 'var(--admin-hover-bg)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    color: 'var(--admin-primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: isUploadingGallery ? 'wait' : 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Upload size={16} />
                  {isUploadingGallery ? 'Uploading Files...' : 'Upload Multiple Files'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    disabled={isUploadingGallery}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleGalleryUpload(e.target.files);
                      }
                    }}
                  />
                </label>

                <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Or paste image URL here..."
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGalleryUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addGalleryUrl}
                    style={{
                      padding: '12px 16px',
                      background: 'transparent',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '8px',
                      color: 'var(--admin-text-primary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Plus size={16} /> Add URL
                  </button>
                </div>
              </div>

              {form.images.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                  {form.images.map((imgUrl, idx) => {
                    const isCover = form.coverImage === imgUrl;
                    return (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          borderRadius: '10px',
                          border: isCover ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                          overflow: 'hidden',
                          background: 'var(--admin-bg-page)',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: isCover ? '0 0 0 2px rgba(99,102,241,0.2)' : 'none',
                        }}
                      >
                        <div style={{ position: 'relative', aspectRatio: '1', width: '100%' }}>
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '6px',
                              left: '6px',
                              background: 'rgba(0,0,0,0.65)',
                              color: '#FFFFFF',
                              fontSize: '0.6875rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontFamily: 'var(--font-outfit), sans-serif',
                              fontWeight: 600,
                            }}
                          >
                            #{idx + 1}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            title="Remove image"
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: '#FFFFFF',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Controls bar */}
                        <div
                          style={{
                            padding: '8px',
                            background: 'var(--admin-bg-card)',
                            borderTop: '1px solid var(--admin-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => moveGalleryImage(idx, 'left')}
                              disabled={idx === 0}
                              title="Move left"
                              style={{
                                flex: 1,
                                padding: '4px 8px',
                                background: idx === 0 ? 'transparent' : 'var(--admin-hover-bg)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                color: idx === 0 ? 'var(--admin-text-secondary)' : 'var(--admin-text-primary)',
                                opacity: idx === 0 ? 0.4 : 1,
                                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                              }}
                            >
                              <ArrowLeft size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGalleryImage(idx, 'right')}
                              disabled={idx === form.images.length - 1}
                              title="Move right"
                              style={{
                                flex: 1,
                                padding: '4px 8px',
                                background: idx === form.images.length - 1 ? 'transparent' : 'var(--admin-hover-bg)',
                                border: '1px solid var(--admin-border)',
                                borderRadius: '6px',
                                color: idx === form.images.length - 1 ? 'var(--admin-text-secondary)' : 'var(--admin-text-primary)',
                                opacity: idx === form.images.length - 1 ? 0.4 : 1,
                                cursor: idx === form.images.length - 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                              }}
                            >
                              <ArrowRight size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setAsCover(imgUrl)}
                            style={{
                              width: '100%',
                              padding: '5px 8px',
                              background: isCover ? 'var(--admin-primary)' : 'transparent',
                              border: isCover ? 'none' : '1px solid var(--admin-border)',
                              borderRadius: '6px',
                              color: isCover ? '#FFFFFF' : 'var(--admin-text-secondary)',
                              fontSize: '0.75rem',
                              fontWeight: isCover ? 600 : 400,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                          >
                            <Star size={12} fill={isCover ? '#FFFFFF' : 'none'} />
                            {isCover ? 'Cover Image' : 'Set Cover'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    padding: '24px',
                    border: '1px dashed var(--admin-border)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: 'var(--admin-text-secondary)',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-outfit), sans-serif',
                  }}
                >
                  No gallery images added yet. Upload multiple files or paste image URLs.
                </div>
              )}
            </div>

            <div style={{ marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button type="button" onClick={() => setForm((p) => ({ ...p, isPublished: !p.isPublished }))} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: form.isPublished ? 'var(--admin-primary)' : '#E5E7EB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <span style={{ position: 'absolute', top: '2px', left: form.isPublished ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#111827', transition: 'left 0.2s' }} />
                </button>
                <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)' }}>{form.isPublished ? 'Published' : 'Draft'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button type="button" onClick={() => setForm((p) => ({ ...p, isHeadliner: !p.isHeadliner }))} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: form.isHeadliner ? '#EAB308' : '#E5E7EB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <span style={{ position: 'absolute', top: '2px', left: form.isHeadliner ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#111827', transition: 'left 0.2s' }} />
                </button>
                <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} fill={form.isHeadliner ? '#EAB308' : 'none'} color={form.isHeadliner ? '#EAB308' : 'currentColor'} />
                  {form.isHeadliner ? 'Headliner (Home Slider)' : 'Normal Project'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={isSubmitting} style={{ padding: '12px 24px', background: 'var(--admin-primary)', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Save size={16} /> {isSubmitting ? 'Saving...' : 'Update Project'}
              </button>
              <button type="button" onClick={() => router.push('/admin/projects')} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-secondary)', fontSize: '0.875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
