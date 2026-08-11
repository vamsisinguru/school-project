import { redirect } from 'next/navigation';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge } from '@/components/ui';
import {
  LayoutDashboard, Users, CheckSquare, FileEdit, Clock,
  Bell, Calendar, GraduationCap, BookOpen,
} from 'lucide-react';
import { formatDate, getAvatarUrl } from '@/lib/utils';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/staff', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/staff/students', label: 'Students', icon: 'users' },
  { href: '/portal/staff/attendance', label: 'Attendance', icon: 'check-square' },
  { href: '/portal/staff/marks', label: 'Marks', icon: 'file-edit' },
  { href: '/portal/staff/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/staff/notices', label: 'Notices', icon: 'bell' },
  { href: '/portal/staff/events', label: 'Events', icon: 'calendar' },
];

export default async function StaffDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') redirect('/login');

  const staff = await getStaffForUser(session.id);
  if (!staff) redirect('/login');

  const [subjects, students, notices, events, exams] = await Promise.all([
    prisma.subject.findMany({
      where: { staffId: staff.id },
      include: { class: true },
    }),
    prisma.student.findMany({
      where: { class: { subjects: { some: { staffId: staff.id } } } },
      include: { user: true, class: true, section: true },
      take: 5,
    }),
    prisma.notice.findMany({ orderBy: { publishDate: 'desc' }, take: 5 }),
    prisma.event.findMany({ where: { startDate: { gte: new Date() } }, orderBy: { startDate: 'asc' }, take: 3 }),
    prisma.exam.findMany({ orderBy: { startDate: 'desc' }, take: 3 }),
  ]);

  const totalStudents = await prisma.student.count({
    where: { class: { subjects: { some: { staffId: staff.id } } } },
  });

  const quickAccess = [
    { label: 'Students', icon: Users, href: '/portal/staff/students', color: 'bg-blue-50 text-blue-600' },
    { label: 'Attendance', icon: CheckSquare, href: '/portal/staff/attendance', color: 'bg-green-50 text-green-600' },
    { label: 'Marks', icon: FileEdit, href: '/portal/staff/marks', color: 'bg-gold-50 text-gold-600' },
    { label: 'Timetable', icon: Clock, href: '/portal/staff/timetable', color: 'bg-purple-50 text-purple-600' },
    { label: 'Notices', icon: Bell, href: '/portal/staff/notices', color: 'bg-red-50 text-red-600' },
    { label: 'Events', icon: Calendar, href: '/portal/staff/events', color: 'bg-teal-50 text-teal-600' },
  ];

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="STAFF" basePath="/portal/staff" notifications={notices.length}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Welcome, {session.name} 👋</h1>
        <p className="text-sm text-navy-500 mt-1">{staff.designation} • Employee ID: {staff.employeeId}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-medium text-navy-500">My Students</p><p className="text-2xl font-bold text-navy-900 mt-1">{totalStudents}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Users className="h-5 w-5 text-blue-600" /></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-medium text-navy-500">My Subjects</p><p className="text-2xl font-bold text-navy-900 mt-1">{subjects.length}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50"><BookOpen className="h-5 w-5 text-gold-600" /></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-medium text-navy-500">Notices</p><p className="text-2xl font-bold text-navy-900 mt-1">{notices.length}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50"><Bell className="h-5 w-5 text-red-600" /></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-medium text-navy-500">Upcoming Events</p><p className="text-2xl font-bold text-navy-900 mt-1">{events.length}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50"><Calendar className="h-5 w-5 text-purple-600" /></div>
          </div>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-navy-700 mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickAccess.map(item => (
            <a key={item.href} href={item.href} className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}><item.icon className="h-5 w-5" /></div>
              <span className="text-xs font-medium text-navy-700">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Subjects */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy-900 mb-4">My Subjects</h3>
          <div className="space-y-2">
            {subjects.map(s => (
              <div key={s.id} className="flex items-center justify-between border-b border-navy-50 pb-2 last:border-0">
                <div><p className="text-sm font-medium text-navy-900">{s.name}</p><p className="text-xs text-navy-500">{s.class.name}</p></div>
                <Badge>{s.code}</Badge>
              </div>
            ))}
            {subjects.length === 0 && <p className="text-sm text-navy-400">No subjects assigned.</p>}
          </div>
        </Card>

        {/* Recent Notices */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {notices.map(n => (
              <div key={n.id} className="border-b border-navy-50 pb-3 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-navy-900">{n.title}</p>
                  {n.priority === 'High' && <Badge variant="danger">High</Badge>}
                </div>
                <p className="text-xs text-navy-400 mt-1">{formatDate(n.publishDate)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Students */}
      <Card className="mt-6 p-6">
        <h3 className="font-semibold text-navy-900 mb-4">Recent Students</h3>
        <div className="space-y-2">
          {students.map(s => (
            <div key={s.id} className="flex items-center gap-3 border-b border-navy-50 pb-2 last:border-0">
              <img src={getAvatarUrl(s.user.name)} alt="" className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-900">{s.user.name}</p>
                <p className="text-xs text-navy-500">{s.class.name} - {s.section.name} • Roll: {s.rollNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
