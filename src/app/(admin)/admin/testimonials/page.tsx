'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { AdminTopbar } from '@/features/admin';
import { MessageSquareQuote, Plus, Save, X, Edit2, Trash2, Upload, User } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  project: string;
  avatarUrl?: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ quote: '', name: '', role: '', project: '', avatarUrl: '', isPublished: false });

  const fetchData = () => {
    setIsLoading(true);
    fetch('/api/admin/testimonials')
      .then((r) => r.json())
      .then((d) => {
        setTestimonials(d.data || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ quote: '', name: '', role: '', project: '', avatarUrl: '', isPublished: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (t: Testimonial) => {
    setForm({
      quote: t.quote,
      name: t.name,
      role: t.role,
      project: t.project,
      avatarUrl: t.avatarUrl || '',
      isPublished: t.isPublished,
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.data?.url) {
        setForm((p) => ({ ...p, avatarUrl: data.data.url }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      resetForm();
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    fetchData();
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
      <AdminTopbar title="Testimonials" subtitle="Manage client testimonials and feedback" />
      <div className="p-4 md:p-8 w-full">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', margin: 0 }}>
            {testimonials.length} testimonial(s)
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            style={{
              padding: '10px 20px',
              background: 'var(--admin-primary)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} /> Add New
          </button>
        </div>

        {showForm && (
          <div
            style={{
              background: 'var(--admin-bg-card)',
              boxShadow: 'var(--admin-shadow)',
              border: 'none',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3
              style={{
                color: 'var(--admin-text-primary)',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: 'var(--font-outfit), sans-serif',
                margin: '0 0 20px',
              }}
            >
              {editingId ? 'Edit' : 'Add'} Testimonial
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Quote</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
                  required
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Project Name</label>
                  <input
                    type="text"
                    value={form.project}
                    onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Client Avatar URL / Photo</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={form.avatarUrl}
                      onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Image URL or upload file"
                      onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')}
                    />
                    <label
                      style={{
                        padding: '12px 16px',
                        background: 'var(--admin-hover-bg)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        color: 'var(--admin-primary)',
                        fontSize: '0.8125rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
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
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(f);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: 'var(--admin-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Save size={15} /> {editingId ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    color: 'var(--admin-text-secondary)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <X size={15} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div
          style={{
            background: 'var(--admin-bg-card)',
            boxShadow: 'var(--admin-shadow)',
            border: 'none',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              Loading...
            </div>
          ) : testimonials.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <MessageSquareQuote size={48} />
              </div>
              <p>No testimonials found</p>
            </div>
          ) : (
            testimonials.map((t, idx) => (
              <div
                key={t.id}
                style={{
                  padding: '20px 24px',
                  borderBottom: idx < testimonials.length - 1 ? '1px solid var(--admin-border)' : 'none',
                  transition: 'background 0.2s',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover-bg)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'var(--admin-hover-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--admin-border)',
                  }}
                >
                  {t.avatarUrl ? (
                    <Image
                      src={t.avatarUrl}
                      alt={t.name}
                      width={44}
                      height={44}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      unoptimized
                    />
                  ) : (
                    <User size={20} style={{ color: 'var(--admin-primary)' }} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: 'var(--admin-text-primary)',
                      fontSize: '0.9375rem',
                      fontStyle: 'italic',
                      margin: '0 0 8px',
                      fontFamily: 'var(--font-outfit), sans-serif',
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ color: 'var(--admin-primary)', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {t.name}
                      </span>
                      <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.75rem' }}>
                        {' '}
                        — {t.role} • {t.project}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(t)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'var(--admin-hover-bg)',
                          color: 'var(--admin-primary)',
                          fontSize: '0.75rem',
                          border: '1px solid var(--admin-border)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(239,68,68,0.1)',
                          color: '#EF4444',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(239,68,68,0.2)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
