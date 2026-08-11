import { redirect } from 'next/navigation';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge } from '@/components/ui';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar,
  Bell, Image, FileText, UserCog, ClipboardList,
} from 'lucide-react';
import { formatDate, getAvatarUrl } from '@/lib/utils';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/admin', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/admin/students', label: 'Students', icon: 'users' },
  { href: '/portal/admin/staff', label: 'Staff', icon: 'user-cog' },
  { href: '/portal/admin/admissions', label: 'Admissions', icon: 'clipboard-list' },
  { href: '/portal/admin/notices', label: 'Notices', icon: 'bell' },
  { href: '/portal/admin/events', label: 'Events', icon: 'calendar' },
  { href: '/portal/admin/gallery', label: 'Gallery', icon: 'image' },
];

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') redirect('/login');

  const staff = await getStaffForUser(session.id);
  if (!staff || !staff.isAdmin) redirect('/login');

  const [studentCount, staffCount, parentCount, classCount, subjectCount, noticeCount, eventCount, admissionCount, pendingAdmissions, recentAdmissions] = await Promise.all([
    prisma.student.count(),
    prisma.staff.count(),
    prisma.parent.count(),
    prisma.class.count(),
    prisma.subject.count(),
    prisma.notice.count(),
    prisma.event.count(),
    prisma.admission.count(),
    prisma.admission.count({ where: { status: 'Pending' } }),
    prisma.admission.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const stats = [
    { label: 'Students', value: studentCount, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Staff', value: staffCount, icon: UserCog, color: 'bg-purple-50 text-purple-600' },
    { label: 'Parents', value: parentCount, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Classes', value: classCount, icon: BookOpen, color: 'bg-gold-50 text-gold-600' },
    { label: 'Subjects', value: subjectCount, icon: GraduationCap, color: 'bg-teal-50 text-teal-600' },
    { label: 'Notices', value: noticeCount, icon: Bell, color: 'bg-red-50 text-red-600' },
    { label: 'Events', value: eventCount, icon: Calendar, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Admissions', value: admissionCount, icon: ClipboardList, color: 'bg-pink-50 text-pink-600' },
  ];

  const quickAccess = [
    { label: 'Students', icon: Users, href: '/portal/admin/students', color: 'bg-blue-50 text-blue-600' },
    { label: 'Staff', icon: UserCog, href: '/portal/admin/staff', color: 'bg-purple-50 text-purple-600' },
    { label: 'Admissions', icon: ClipboardList, href: '/portal/admin/admissions', color: 'bg-pink-50 text-pink-600' },
    { label: 'Notices', icon: Bell, href: '/portal/admin/notices', color: 'bg-red-50 text-red-600' },
    { label: 'Events', icon: Calendar, href: '/portal/admin/events', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Gallery', icon: Image, href: '/portal/admin/gallery', color: 'bg-teal-50 text-teal-600' },
  ];

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="ADMIN" basePath="/portal/admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
        <p className="text-sm text-navy-500 mt-1">Complete school management overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-navy-500">{stat.label}</p>
                <p className="text-2xl font-bold text-navy-900 mt-1">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pending Admissions Alert */}
      {pendingAdmissions > 0 && (
        <Card className="mb-6 p-4 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>{pendingAdmissions}</strong> admission enquiries pending review.
              <a href="/portal/admin/admissions" className="ml-2 font-semibold underline">Review now →</a>
            </p>
          </div>
        </Card>
      )}

      {/* Quick Access */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-navy-700 mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickAccess.map(item => (
            <a key={item.href} href={item.href} className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-navy-700">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Admissions */}
      <Card className="p-6">
        <h3 className="font-semibold text-navy-900 mb-4">Recent Admission Enquiries</h3>
        {recentAdmissions.length === 0 ? (
          <p className="text-sm text-navy-400">No admission enquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {recentAdmissions.map(adm => (
              <div key={adm.id} className="flex items-center justify-between border-b border-navy-50 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy-900">{adm.studentName}</p>
                  <p className="text-xs text-navy-500">Parent: {adm.parentName} • Class: {adm.applyingClass}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={adm.status === 'Pending' ? 'warning' : adm.status === 'Approved' ? 'success' : 'danger'}>
                    {adm.status}
                  </Badge>
                  <span className="text-xs text-navy-400">{formatDate(adm.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}
