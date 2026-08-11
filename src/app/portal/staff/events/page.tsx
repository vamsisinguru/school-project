'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Button, Input, Select, Textarea, Badge, EmptyState, Modal, ConfirmDialog, Skeleton } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LayoutDashboard, Users, CheckSquare, FileEdit, Clock, Bell, Calendar, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const navItems = [
  { href: '/portal/staff', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/staff/students', label: 'Students', icon: 'users' },
  { href: '/portal/staff/attendance', label: 'Attendance', icon: 'check-square' },
  { href: '/portal/staff/marks', label: 'Marks', icon: 'file-edit' },
  { href: '/portal/staff/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/staff/notices', label: 'Notices', icon: 'bell' },
  { href: '/portal/staff/events', label: 'Events', icon: 'calendar' },
];

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  venue?: string;
  imageUrl?: string;
}

export default function StaffEventsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Cultural', startDate: '', venue: '', imageUrl: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/staff/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
        setCanManage(data.canManage);
      }
    } catch {}
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: 'Cultural', startDate: '', venue: '', imageUrl: '' });
    setModalOpen(true);
  };

  const openEdit = (event: Event) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      startDate: event.startDate.split('T')[0],
      venue: event.venue || '',
      imageUrl: event.imageUrl || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.startDate) {
      toast('Title, description, and date are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/staff/events/${editing.id}` : '/api/staff/events';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast(editing ? 'Event updated successfully!' : 'Event created successfully!', 'success');
        setModalOpen(false);
        fetchData();
      } else {
        toast('Failed to save event', 'error');
      }
    } catch {
      toast('An error occurred', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/staff/events/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Event deleted successfully!', 'success');
        fetchData();
      }
    } catch {
      toast('An error occurred', 'error');
    }
  };

  return (
    <DashboardShell navItems={navItems} userName="" userRole="STAFF" basePath="/portal/staff">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Events Management</h1>
          <p className="text-sm text-navy-500 mt-1">Create and manage school events.</p>
        </div>
        {canManage && <Button onClick={openCreate}><Plus className="h-4 w-4" /> Create Event</Button>}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}</div>
      ) : events.length === 0 ? (
        <Card><EmptyState icon={Calendar} title="No Events" description="No events have been created yet." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <Card key={event.id} className="overflow-hidden">
              {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-32 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-navy-900">{event.title}</h3>
                  <Badge variant="info">{event.category}</Badge>
                </div>
                <p className="text-sm text-navy-500 line-clamp-2">{event.description}</p>
                <div className="mt-3 space-y-1 text-xs text-navy-400">
                  <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(event.startDate)}</p>
                  {event.venue && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.venue}</p>}
                </div>
                {canManage && (
                  <div className="mt-3 flex gap-2 border-t border-navy-50 pt-3">
                    <button onClick={() => openEdit(event)} className="text-navy-500 hover:text-navy-900"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteId(event.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Event' : 'Create Event'}>
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
          <Textarea label="Description *" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Event description" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['Cultural', 'Sports', 'Academic', 'PTM', 'Holiday'].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Input label="Date *" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <Input label="Venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Event venue" />
          <Input label="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        confirmText="Delete"
        danger
      />
    </DashboardShell>
  );
}
