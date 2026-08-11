'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, EmptyState, Skeleton } from '@/components/ui';
import { LayoutDashboard, Users, UserCog, ClipboardList, Bell, Calendar, Image } from 'lucide-react';
import { getAvatarUrl } from '@/lib/utils';

const navItems = [
  { href: '/portal/admin', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/admin/students', label: 'Students', icon: 'users' },
  { href: '/portal/admin/staff', label: 'Staff', icon: 'user-cog' },
  { href: '/portal/admin/admissions', label: 'Admissions', icon: 'clipboard-list' },
  { href: '/portal/admin/notices', label: 'Notices', icon: 'bell' },
  { href: '/portal/admin/events', label: 'Events', icon: 'calendar' },
  { href: '/portal/admin/gallery', label: 'Gallery', icon: 'image' },
];

export default function AdminStaffPage() {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/staff');
        if (res.ok) {
          const data = await res.json();
          setStaff(data.staff);
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <DashboardShell navItems={navItems} userName="" userRole="ADMIN" basePath="/portal/admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Staff Management</h1>
        <p className="text-sm text-navy-500 mt-1">View all teaching and administrative staff.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
      ) : staff.length === 0 ? (
        <Card><EmptyState icon={UserCog} title="No Staff Found" /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s: any) => (
            <Card key={s.id} className="p-5">
              <div className="flex items-center gap-3">
                <img src={getAvatarUrl(s.name)} alt="" className="h-12 w-12 rounded-full" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-navy-900 truncate">{s.name}</h3>
                  <p className="text-xs text-navy-500">{s.designation}</p>
                </div>
                {s.isAdmin && <Badge variant="danger">Admin</Badge>}
              </div>
              <div className="mt-4 space-y-1 text-xs text-navy-500">
                <p>Employee ID: <strong className="text-navy-700">{s.employeeId}</strong></p>
                <p>Email: {s.email}</p>
                {s.qualification && <p>Qualification: {s.qualification}</p>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {s.canManageTimetable && <Badge variant="info">Timetable</Badge>}
                {s.canManageNotices && <Badge variant="warning">Notices</Badge>}
                {s.canManageEvents && <Badge variant="success">Events</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
