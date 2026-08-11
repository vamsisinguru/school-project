'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Button, Input, Select, Textarea, Badge, EmptyState, Modal, ConfirmDialog, Skeleton } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LayoutDashboard, Users, CheckSquare, FileEdit, Clock, Bell, Calendar, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
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

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  publishDate: string;
}

export default function StaffNoticesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'General', priority: 'Normal' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/staff/notices');
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices);
        setCanManage(data.canManage);
      }
    } catch {}
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', category: 'General', priority: 'Normal' });
    setModalOpen(true);
  };

  const openEdit = (notice: Notice) => {
    setEditing(notice);
    setForm({ title: notice.title, content: notice.content, category: notice.category, priority: notice.priority });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast('Title and content are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/staff/notices/${editing.id}` : '/api/staff/notices';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast(editing ? 'Notice updated successfully!' : 'Notice created successfully!', 'success');
        setModalOpen(false);
        fetchData();
      } else {
        toast('Failed to save notice', 'error');
      }
    } catch {
      toast('An error occurred', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/staff/notices/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Notice deleted successfully!', 'success');
        fetchData();
      } else {
        toast('Failed to delete notice', 'error');
      }
    } catch {
      toast('An error occurred', 'error');
    }
  };

  const categoryColors: Record<string, any> = {
    Holiday: 'danger', Examination: 'info', PTM: 'warning', Fee: 'danger', Event: 'success', Circular: 'default', General: 'default',
  };

  return (
    <DashboardShell navItems={navItems} userName="" userRole="STAFF" basePath="/portal/staff">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Notices Management</h1>
          <p className="text-sm text-navy-500 mt-1">Create and manage school notices.</p>
        </div>
        {canManage && <Button onClick={openCreate}><Plus className="h-4 w-4" /> Create Notice</Button>}
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : notices.length === 0 ? (
        <Card><EmptyState icon={Bell} title="No Notices" description="No notices have been created yet." /></Card>
      ) : (
        <div className="space-y-3">
          {notices.map(notice => (
            <Card key={notice.id} className="p-5">
              <div className="flex items-start gap-3">
                {notice.priority === 'High' ? (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-50">
                    <Bell className="h-5 w-5 text-navy-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-navy-900">{notice.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={categoryColors[notice.category] || 'default'}>{notice.category}</Badge>
                      {notice.priority === 'High' && <Badge variant="danger">High</Badge>}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-navy-600">{notice.content}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-navy-400">{formatDate(notice.publishDate)}</span>
                    {canManage && (
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(notice)} className="text-navy-500 hover:text-navy-900"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteId(notice.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Notice' : 'Create Notice'}>
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Notice title" />
          <Textarea label="Content *" rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Notice content" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {['General', 'Holiday', 'Examination', 'PTM', 'Fee', 'Event', 'Circular'].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </Select>
          </div>
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
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </DashboardShell>
  );
}
