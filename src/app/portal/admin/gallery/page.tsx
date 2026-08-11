'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Button, Input, Select, Badge, EmptyState, Modal, ConfirmDialog, Skeleton } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LayoutDashboard, Users, UserCog, ClipboardList, Bell, Calendar, Image, Plus, Trash2 } from 'lucide-react';

const navItems = [
  { href: '/portal/admin', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/admin/students', label: 'Students', icon: 'users' },
  { href: '/portal/admin/staff', label: 'Staff', icon: 'user-cog' },
  { href: '/portal/admin/admissions', label: 'Admissions', icon: 'clipboard-list' },
  { href: '/portal/admin/notices', label: 'Notices', icon: 'bell' },
  { href: '/portal/admin/events', label: 'Events', icon: 'calendar' },
  { href: '/portal/admin/gallery', label: 'Gallery', icon: 'image' },
];

const categories = ['Campus', 'Classrooms', 'Sports', 'Events', 'Cultural Activities', 'Annual Day', 'Field Trips'];

export default function AdminGalleryPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Campus', imageUrl: '', description: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) { const data = await res.json(); setItems(data.items); }
    } catch {}
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) { toast('Title and image URL required', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast('Gallery item added!', 'success'); setModalOpen(false); setForm({ title: '', category: 'Campus', imageUrl: '', description: '' }); fetchData(); }
      else { toast('Failed to add', 'error'); }
    } catch { toast('Error occurred', 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { const res = await fetch(`/api/admin/gallery/${deleteId}`, { method: 'DELETE' }); if (res.ok) { toast('Item deleted!', 'success'); fetchData(); } }
    catch { toast('Error occurred', 'error'); }
  };

  return (
    <DashboardShell navItems={navItems} userName="" userRole="ADMIN" basePath="/portal/admin">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-navy-900">Gallery Management</h1><p className="text-sm text-navy-500 mt-1">Manage school gallery images.</p></div>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Image</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}</div>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={Image} title="No Images" description="Add images to the gallery." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item: any) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative h-40">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <button onClick={() => setDeleteId(item.id)} className="absolute top-2 right-2 rounded-lg bg-red-500 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-navy-900 truncate">{item.title}</h3>
                  <Badge>{item.category}</Badge>
                </div>
                {item.description && <p className="text-xs text-navy-500 mt-1 line-clamp-1">{item.description}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Gallery Image">
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Image title" />
          <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Image URL *" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Add Image</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Image" message="Delete this gallery image?" confirmText="Delete" danger />
    </DashboardShell>
  );
}
