import { redirect } from 'next/navigation';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { TimetableView } from '@/components/dashboard/TimetableView';
import { LayoutDashboard, Users, CheckSquare, FileEdit, Clock, Bell, Calendar } from 'lucide-react';

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

export default async function StaffTimetablePage() {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') redirect('/login');

  const staff = await getStaffForUser(session.id);
  if (!staff) redirect('/login');

  const subjects = await prisma.subject.findMany({ where: { staffId: staff.id } });
  const classIds = [...new Set(subjects.map(s => s.classId))];

  const timetables = await prisma.timetable.findMany({
    where: { classId: { in: classIds }, isActive: true },
    include: {
      periods: {
        include: { subject: true, staff: { include: { user: true } } },
        orderBy: { periodNumber: 'asc' },
      },
      class: true,
    },
  });

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="STAFF" basePath="/portal/staff">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Timetable</h1>
        <p className="text-sm text-navy-500 mt-1">View class timetables for your subjects.</p>
      </div>

      {classIds.length === 0 ? (
        <div className="rounded-lg bg-navy-50 p-8 text-center text-sm text-navy-500">
          No timetables available for your assigned subjects.
        </div>
      ) : (
        <div className="space-y-8">
          {[...new Set(timetables.map(t => t.class.name))].map(className => {
            const classTimetables = timetables.filter(t => t.class.name === className);
            return (
              <div key={className}>
                <h2 className="text-lg font-semibold text-navy-900 mb-4">{className}</h2>
                <TimetableView timetables={classTimetables} />
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
