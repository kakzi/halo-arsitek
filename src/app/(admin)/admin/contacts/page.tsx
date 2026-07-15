'use client';

import { useEffect, useState } from 'react';
import { AdminTopbar } from '@/features/admin';
import { Mail } from 'lucide-react';

interface Contact { id: string; name: string; email: string; phone: string | null; message: string; budget: string | null; status: string; readAt: string | null; createdAt: string; }

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState('');

  const fetchData = () => {
    setIsLoading(true);
    const url = filter ? `/api/admin/contacts?status=${filter}` : '/api/admin/contacts';
    fetch(url).then((r) => r.json()).then((d) => { setContacts(d.data || []); setIsLoading(false); }).catch(() => setIsLoading(false));
  };

  useEffect(() => { fetchData(); }, [filter]);

  const markAsRead = async (id: string) => {
    await fetch(`/api/admin/contacts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'READ' }) });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini?')) return;
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
    setSelectedContact(null);
    fetchData();
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    UNREAD: { bg: 'rgba(200, 169, 126, 0.1)', text: '#C8A97E' },
    READ: { bg: 'rgba(138, 138, 142, 0.1)', text: '#8A8A8E' },
    REPLIED: { bg: 'rgba(52, 211, 153, 0.1)', text: '#34D399' },
    ARCHIVED: { bg: 'rgba(60, 60, 62, 0.3)', text: '#3C3C3E' },
  };

  return (
    <>
      <AdminTopbar title="Contact Submissions" subtitle="Pesan dari pengunjung website" />
      <div className="p-4 md:p-8">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['', 'UNREAD', 'READ', 'REPLIED'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: '100px', background: filter === f ? 'rgba(200, 169, 126, 0.15)' : '#FFFFFF', border: `1px solid ${filter === f ? '#C8A97E' : '#E5E7EB'}`, color: filter === f ? '#C8A97E' : '#8A8A8E', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              {f || 'Semua'}
            </button>
          ))}
        </div>

        <div className={`grid ${selectedContact ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-5`}>
          {/* List */}
          <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', overflow: 'hidden' }}>
            {isLoading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>Loading...</div> : contacts.length === 0 ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}><div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><Mail size={32} /></div><p>Belum ada pesan</p></div> : contacts.map((c, idx) => (
              <div key={c.id} onClick={() => { setSelectedContact(c); if (c.status === 'UNREAD') markAsRead(c.id); }} style={{ padding: '16px 20px', borderBottom: idx < contacts.length - 1 ? '1px solid #F9FAFB' : 'none', cursor: 'pointer', background: selectedContact?.id === c.id ? '#F9FAFB' : 'transparent', transition: 'background 0.2s' }} onMouseEnter={(e) => { if (selectedContact?.id !== c.id) e.currentTarget.style.background = '#F9FAFB'; }} onMouseLeave={(e) => { if (selectedContact?.id !== c.id) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.status === 'UNREAD' ? '#C8A97E' : '#3C3C3E', flexShrink: 0 }} />
                  <span style={{ color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontWeight: c.status === 'UNREAD' ? 600 : 400 }}>{c.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', color: '#3C3C3E' }}>{new Date(c.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', margin: '0 0 0 20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</p>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedContact && (
            <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1.125rem', fontWeight: 600, margin: '0 0 4px' }}>{selectedContact.name}</h3>
                  <p style={{ color: '#C8A97E', fontSize: '0.8125rem', margin: 0 }}>{selectedContact.email}</p>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.6875rem', background: statusColors[selectedContact.status]?.bg, color: statusColors[selectedContact.status]?.text, border: `1px solid ${statusColors[selectedContact.status]?.text}30` }}>{selectedContact.status}</span>
              </div>

              {selectedContact.phone && <div style={{ marginBottom: '16px' }}><span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Telepon</span><p style={{ color: 'var(--admin-text-primary)', fontSize: '0.875rem', margin: '4px 0 0' }}>{selectedContact.phone}</p></div>}
              {selectedContact.budget && <div style={{ marginBottom: '16px' }}><span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Budget</span><p style={{ color: 'var(--admin-text-primary)', fontSize: '0.875rem', margin: '4px 0 0' }}>{selectedContact.budget}</p></div>}

              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pesan</span>
                <p style={{ color: 'var(--admin-text-primary)', fontSize: '0.875rem', margin: '8px 0 0', lineHeight: 1.7, background: 'var(--admin-bg-card)', borderRadius: '8px', padding: '16px' }}>{selectedContact.message}</p>
              </div>

              <div style={{ fontSize: '0.6875rem', color: '#3C3C3E', marginBottom: '20px' }}>
                Diterima: {new Date(selectedContact.createdAt).toLocaleString('id-ID')}
                {selectedContact.readAt && <><br />Dibaca: {new Date(selectedContact.readAt).toLocaleString('id-ID')}</>}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`mailto:${selectedContact.email}`} style={{ padding: '8px 16px', background: 'var(--admin-primary)', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Reply via Email</a>
                <button onClick={() => handleDelete(selectedContact.id)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.8125rem', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
