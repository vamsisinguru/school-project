'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, EmptyState, Skeleton, Button, Select } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LayoutDashboard, Users, UserCog, ClipboardList, Bell, Calendar, Image } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const navItems = [
  { href: '/portal/admin', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/admin/students', label: 'Students', icon: 'users' },
  { href: '/portal/admin/staff', label: 'Staff', icon: 'user-cog' },
  { href: '/portal/admin/admissions', label: 'Admissions', icon: 'clipboard-list' },
  { href: '/portal/admin/notices', label: 'Notices', icon: 'bell' },
  { href: '/portal/admin/events', label: 'Events', icon: 'calendar' },
  { href: '/portal/admin/gallery', label: 'Gallery', icon: 'image' },
];

export default function AdminAdmissionsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/admissions');
      if (res.ok) {
        const data = await res.json();
        setAdmissions(data.admissions);
      }
    } catch {}
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/admissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast(`Admission ${status.toLowerCase()} successfully!`, 'success');
        fetchData();
      } else {
        toast('Failed to update status', 'error');
      }
    } catch {
      toast('An error occurred', 'error');
    }
  };

  const filtered = statusFilter ? admissions.filter(a => a.status === statusFilter) : admissions;

  return (
    <DashboardShell navItems={navItems} userName="" userRole="ADMIN" basePath="/portal/admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Admission Enquiries</h1>
        <p className="text-sm text-navy-500 mt-1">Review and manage admission applications.</p>
      </div>

      <Card className="mb-6 p-4">
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="!w-auto">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </Select>
      </Card>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={ClipboardList} title="No Applications" description="No admission enquiries found." /></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((adm: any) => (
            <Card key={adm.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-navy-900">{adm.studentName}</h3>
                    <Badge variant={adm.status === 'Pending' ? 'warning' : adm.status === 'Approved' ? 'success' : 'danger'}>
                      {adm.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-navy-500 mt-2">
                    <p>Parent: <strong className="text-navy-700">{adm.parentName}</strong></p>
                    <p>Class: <strong className="text-navy-700">{adm.applyingClass}</strong></p>
                    <p>Email: {adm.email}</p>
                    <p>Phone: {adm.phone}</p>
                  </div>
                  {adm.message && <p className="text-sm text-navy-600 mt-2 bg-navy-50 rounded-lg px-3 py-2">{adm.message}</p>}
                  <p className="text-xs text-navy-400 mt-2">Submitted: {formatDate(adm.createdAt)}</p>
                </div>
                {adm.status === 'Pending' && (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => updateStatus(adm.id, 'Approved')} className="!bg-green-50 !text-green-700 !border-green-200">Approve</Button>
                    <Button variant="secondary" onClick={() => updateStatus(adm.id, 'Rejected')} className="!bg-red-50 !text-red-700 !border-red-200">Reject</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
