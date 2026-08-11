import { redirect } from 'next/navigation';
import { getSession, getStudentForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, EmptyState } from '@/components/ui';
import { LayoutDashboard, CheckCircle2, Clock, GraduationCap, Bell, BookOpen, ClipboardList } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/student', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/student/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/student/attendance', label: 'Attendance', icon: 'check-circle' },
  { href: '/portal/student/assignments', label: 'Assignments', icon: 'book-open' },
  { href: '/portal/student/exams', label: 'Exams & Results', icon: 'graduation-cap' },
  { href: '/portal/student/notices', label: 'Notices', icon: 'bell' },
];

export default async function StudentAssignmentsPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') redirect('/login');

  const student = await getStudentForUser(session.id);
  if (!student) redirect('/login');

  const assignments = await prisma.studentAssignment.findMany({
    where: { studentId: student.id },
    include: { assignment: { include: { subject: true } } },
    orderBy: { assignment: { dueDate: 'asc' } },
  });

  const pending = assignments.filter(a => a.status === 'Pending');
  const submitted = assignments.filter(a => a.status === 'Submitted');
  const graded = assignments.filter(a => a.status === 'Graded' || a.marks !== null);

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="STUDENT" basePath="/portal/student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">My Assignments</h1>
        <p className="text-sm text-navy-500 mt-1">{student.class.name} - {student.section.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card className="p-5 text-center">
          <ClipboardList className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-navy-900">{pending.length}</p>
          <p className="text-xs text-navy-500">Pending</p>
        </Card>
        <Card className="p-5 text-center">
          <CheckCircle2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-navy-900">{submitted.length}</p>
          <p className="text-xs text-navy-500">Submitted</p>
        </Card>
        <Card className="p-5 text-center">
          <GraduationCap className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-navy-900">{graded.length}</p>
          <p className="text-xs text-navy-500">Graded</p>
        </Card>
      </div>

      {assignments.length === 0 ? (
        <Card><EmptyState icon={BookOpen} title="No Assignments" description="You have no assignments at this time." /></Card>
      ) : (
        <div className="space-y-3">
          {assignments.map(sa => (
            <Card key={sa.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-navy-900">{sa.assignment.title}</h3>
                    <Badge variant={sa.status === 'Pending' ? 'warning' : sa.status === 'Submitted' ? 'info' : 'success'}>
                      {sa.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-navy-500">{sa.assignment.subject.name}</p>
                  <p className="text-sm text-navy-600 mt-2">{sa.assignment.description}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-navy-400">
                    <span>Due: {formatDate(sa.assignment.dueDate)}</span>
                    <span>Max Marks: {sa.assignment.maxMarks}</span>
                    {sa.marks !== null && sa.marks !== undefined && <span>Scored: <strong className="text-navy-700">{sa.marks}/{sa.assignment.maxMarks}</strong></span>}
                  </div>
                  {sa.feedback && (
                    <p className="mt-2 text-sm text-navy-600 bg-navy-50 rounded-lg px-3 py-2">📝 {sa.feedback}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
