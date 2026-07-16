'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminTopbar } from '@/features/admin';
import { Building2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  year: number;
  location: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = () => {
    setIsLoading(true);
    fetch('/api/admin/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.data || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus project ini?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Gagal menghapus');
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: !isPublished } : p))
      );
    } catch {
      alert('Gagal mengubah status');
    }
  };

  const categoryColors: Record<string, string> = {
    residensial: '#34D399',
    komersial: '#60A5FA',
    interior: '#F472B6',
  };

  return (
    <>
      <AdminTopbar title="Projects" subtitle="Kelola portofolio proyek arsitektur" />

      <div className="p-4 md:p-8">
        {/* Header Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', margin: 0 }}>
            {projects.length} project(s)
          </p>
          <Link
            href="/admin/projects/new"
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #C8A97E, #A67C52)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--font-outfit), sans-serif',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            + Tambah Project
          </Link>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'var(--admin-bg-card)',
            boxShadow: 'var(--admin-shadow)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>Loading...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><Building2 size={48} /></div>
              <p>Belum ada project. Buat project pertama Anda!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                  {['Title', 'Category', 'Year', 'Location', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 20px',
                        textAlign: 'left',
                        fontSize: '0.6875rem',
                        color: 'var(--admin-text-secondary)',
                        fontFamily: 'var(--font-outfit), sans-serif',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    style={{
                      borderBottom: '1px solid #F9FAFB',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                        {project.title}
                      </span>
                      <br />
                      <span style={{ color: '#3C3C3E', fontSize: '0.75rem' }}>/{project.slug}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '100px',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          background: `${categoryColors[project.category.slug] || '#8A8A8E'}15`,
                          color: categoryColors[project.category.slug] || '#8A8A8E',
                          border: `1px solid ${categoryColors[project.category.slug] || '#8A8A8E'}30`,
                        }}
                      >
                        {project.category.name}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
                      {project.year}
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--admin-text-secondary)', fontSize: '0.875rem' }}>
                      {project.location}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        onClick={() => togglePublish(project.id, project.isPublished)}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '100px',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          background: project.isPublished ? 'rgba(52, 211, 153, 0.1)' : 'rgba(138, 138, 142, 0.1)',
                          color: project.isPublished ? '#34D399' : '#8A8A8E',
                          border: `1px solid ${project.isPublished ? 'rgba(52, 211, 153, 0.3)' : 'rgba(138, 138, 142, 0.3)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {project.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: 'var(--admin-hover-bg)',
                            color: '#C8A97E',
                            fontSize: '0.75rem',
                            textDecoration: 'none',
                            border: '1px solid var(--admin-border)',
                            transition: 'all 0.2s',
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            fontSize: '0.75rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            cursor: deletingId === project.id ? 'not-allowed' : 'pointer',
                            opacity: deletingId === project.id ? 0.5 : 1,
                            transition: 'all 0.2s',
                          }}
                        >
                          {deletingId === project.id ? '...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
