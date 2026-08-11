import { redirect } from 'next/navigation';
import { getSession, getStudentForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { TimetableView } from '@/components/dashboard/TimetableView';
import { LayoutDashboard, CheckCircle2, Clock, GraduationCap, Bell, BookOpen } from 'lucide-react';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/student', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/student/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/student/attendance', label: 'Attendance', icon: 'check-circle' },
  { href: '/portal/student/assignments', label: 'Assignments', icon: 'book-open' },
  { href: '/portal/student/exams', label: 'Exams & Results', icon: 'graduation-cap' },
  { href: '/portal/student/notices', label: 'Notices', icon: 'bell' },
];

export default async function StudentTimetablePage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') redirect('/login');

  const student = await getStudentForUser(session.id);
  if (!student) redirect('/login');

  const timetables = await prisma.timetable.findMany({
    where: { classId: student.classId, isActive: true },
    include: {
      periods: {
        include: { subject: true, staff: { include: { user: true } } },
        orderBy: { periodNumber: 'asc' },
      },
    },
  });

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="STUDENT" basePath="/portal/student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">My Timetable</h1>
        <p className="text-sm text-navy-500 mt-1">{student.class.name} - {student.section.name}</p>
      </div>
      <TimetableView timetables={timetables} />
    </DashboardShell>
  );
}
