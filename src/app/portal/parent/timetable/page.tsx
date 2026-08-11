import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card } from '@/components/ui';
import { TimetableView } from '@/components/dashboard/TimetableView';
import { LayoutDashboard, CheckCircle2, FileText, Clock, GraduationCap, Bell } from 'lucide-react';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/parent', label: 'Overview', icon: LayoutDashboard },
  { href: '/portal/parent/attendance', label: 'Attendance', icon: CheckCircle2 },
  { href: '/portal/parent/report-card', label: 'Report Card', icon: FileText },
  { href: '/portal/parent/timetable', label: 'Timetable', icon: Clock },
  { href: '/portal/parent/exams', label: 'Exams', icon: GraduationCap },
  { href: '/portal/parent/notices', label: 'Notices', icon: Bell },
];

export default async function ParentTimetablePage() {
  const session = await getSession();
  if (!session || session.role !== 'PARENT') redirect('/login');

  const parent = await prisma.parent.findFirst({
    where: { userId: session.id },
    include: {
      children: {
        include: {
          student: { include: { user: true, class: true, section: true } },
        },
      },
    },
  });

  if (!parent || parent.children.length === 0) redirect('/portal/parent');

  const student = parent.children[0].student;

  const timetables = await prisma.timetable.findMany({
    where: { classId: student.classId, isActive: true },
    include: {
      periods: {
        include: {
          subject: true,
          staff: { include: { user: true } },
        },
        orderBy: { periodNumber: 'asc' },
      },
    },
  });

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="PARENT" basePath="/portal/parent">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Timetable</h1>
        <p className="text-sm text-navy-500 mt-1">{student.user.name} - {student.class.name} {student.section.name}</p>
      </div>

      <TimetableView timetables={timetables} />
    </DashboardShell>
  );
}
