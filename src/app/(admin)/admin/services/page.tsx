'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AdminTopbar } from '@/features/admin';
import * as LucideIcons from 'lucide-react';
import { Plus, Save, X, Edit2, Trash2, Search, Grid } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  isPublished: boolean;
  sortOrder: number;
}

const POPULAR_ICONS = [
  'Building', 'Building2', 'Home', 'Landmark', 'Castle', 'Hotel', 'Store', 'Warehouse',
  'Factory', 'Compass', 'Ruler', 'PencilRuler', 'DraftingCompass', 'Hammer', 'Wrench', 'HardHat',
  'Truck', 'Paintbrush', 'Palette', 'Layers', 'Layout', 'LayoutGrid', 'Box', 'Boxes',
  'Component', 'PenTool', 'Lightbulb', 'Lamp', 'Sofa', 'Armchair', 'Sun', 'Moon',
  'Cloud', 'Trees', 'Flower2', 'Wind', 'Droplets', 'Sparkles', 'CheckCircle', 'CheckCircle2',
  'Star', 'Award', 'ShieldCheck', 'Trophy', 'Briefcase', 'Users', 'UserCheck', 'Target',
  'TrendingUp', 'BarChart3', 'PieChart', 'PhoneCall', 'Mail', 'MessageSquare', 'Globe',
  'MapPin', 'Navigation', 'Clock', 'Calendar', 'FileText', 'Folder', 'Camera', 'Video',
  'Eye', 'Lock', 'Key', 'Heart', 'ThumbsUp', 'Bookmark', 'Share2', 'Maximize2', 'Zap', 'Shield'
];

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
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  const fetchData = () => {
    setIsLoading(true);
    fetch('/api/admin/services').then((r) => r.json()).then((d) => { setServices(d.data || []); setIsLoading(false); }).catch(() => setIsLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ title: '', description: '', icon: 'Building', isPublished: false, sortOrder: 0 }); setEditingId(null); setShowForm(false); setShowIconPicker(false); };

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
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-primary)', fontSize: '0.875rem', fontFamily: 'var(--font-outfit), sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.6875rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit), sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '8px' };

  const filteredIcons = POPULAR_ICONS.filter(i => i.toLowerCase().includes(iconSearch.toLowerCase()));

  return (
    <>
      <AdminTopbar title="Services" subtitle="Manage studio services" />
      <div className="p-4 md:p-8 w-full">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-secondary)', margin: 0 }}>{services.length} service(s)</p>
          <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '10px 20px', background: 'var(--admin-primary)', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Plus size={16} /> Add New</button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', margin: '0 0 20px' }}>{editingId ? 'Edit' : 'Add'} Service</h3>
            <form onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Icon Name (Select or Browse)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div
                      onClick={() => setShowIconPicker(true)}
                      title="Click to open visual icon grid"
                      style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--admin-hover-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', cursor: 'pointer', flexShrink: 0, color: 'var(--admin-primary-text)' }}
                    >
                      <DynamicIcon name={form.icon} size={24} />
                    </div>
                    <select
                      value={POPULAR_ICONS.includes(form.icon) ? form.icon : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setForm((p) => ({ ...p, icon: e.target.value }));
                        }
                      }}
                      style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}
                    >
                      {!POPULAR_ICONS.includes(form.icon) && <option value="custom">{form.icon}</option>}
                      {POPULAR_ICONS.map(iName => (
                        <option key={iName} value={iName}>{iName}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(true)}
                      style={{ padding: '12px', background: 'var(--admin-hover-bg)', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-primary-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Browse Icon Grid"
                    >
                      <Grid size={18} />
                    </button>
                  </div>
                </div>
                <div><label style={labelStyle}>Title</label><input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required style={inputStyle} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              </div>

              {/* Icon Picker Popover Grid */}
              {showIconPicker && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                  <div style={{ background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border)', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-outfit), sans-serif' }}>Select Lucide Icon</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-outfit), sans-serif' }}>Choose from {POPULAR_ICONS.length}+ curated architecture & design icons</p>
                      </div>
                      <button type="button" onClick={() => setShowIconPicker(false)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-secondary)', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
                    </div>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--admin-border)' }}>
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)' }} />
                        <input
                          type="text"
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          placeholder="Search icon name (e.g. Building, Compass, Home)..."
                          style={{ ...inputStyle, paddingLeft: '38px' }}
                        />
                      </div>
                    </div>
                    <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
                      {filteredIcons.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', color: 'var(--admin-text-secondary)' }}>No icons matching "{iconSearch}"</div>
                      ) : (
                        filteredIcons.map((iconName) => (
                          <div
                            key={iconName}
                            onClick={() => { setForm((p) => ({ ...p, icon: iconName })); setShowIconPicker(false); setIconSearch(''); }}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '12px 8px',
                              background: form.icon === iconName ? 'var(--admin-hover-bg)' : 'transparent',
                              border: `1px solid ${form.icon === iconName ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              color: form.icon === iconName ? 'var(--admin-primary)' : 'var(--admin-text-primary)'
                            }}
                            onMouseEnter={(e) => { if (form.icon !== iconName) e.currentTarget.style.background = 'var(--admin-hover-bg)'; }}
                            onMouseLeave={(e) => { if (form.icon !== iconName) e.currentTarget.style.background = 'transparent'; }}
                          >
                            <DynamicIcon name={iconName} size={24} />
                            <span style={{ fontSize: '0.6875rem', marginTop: '8px', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-outfit), sans-serif' }}>{iconName}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div style={{ marginBottom: '16px' }}><label style={labelStyle}>Description</label><textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => (e.target.style.borderColor = 'var(--admin-primary)')} onBlur={(e) => (e.target.style.borderColor = 'var(--admin-border)')} /></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--admin-primary)', border: 'none', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Save size={15} /> {editingId ? 'Update' : 'Save'}</button>
                <button type="button" onClick={resetForm} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><X size={15} /> Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? [1, 2, 3, 4].map((i) => <div key={i} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', height: '160px' }} />) : services.length === 0 ? <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--admin-text-secondary)', background: 'var(--admin-bg-card)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}><div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><DynamicIcon name="Box" size={48} /></div><p>No services found</p></div> : services.map((s) => (
            <div key={s.id} style={{ background: 'var(--admin-bg-card)', boxShadow: 'var(--admin-shadow)', border: 'none', borderRadius: '12px', padding: '24px', transition: 'all 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--admin-shadow)')}>
              <div style={{ marginBottom: '16px', color: 'var(--admin-primary-text)' }}>
                <DynamicIcon name={s.icon} />
              </div>
              <h3 style={{ color: 'var(--admin-text-primary)', fontSize: '1rem', fontWeight: 600, margin: '0 0 8px', fontFamily: 'var(--font-outfit), sans-serif' }}>{s.title}</h3>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.8125rem', margin: '0 0 16px', lineHeight: 1.5 }}>{s.description}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(s)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'var(--admin-hover-bg)', color: 'var(--admin-primary-text)', fontSize: '0.75rem', border: '1px solid var(--admin-border)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}><Edit2 size={13} /> Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.75rem', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
