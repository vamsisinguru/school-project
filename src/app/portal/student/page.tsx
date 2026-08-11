import { redirect } from 'next/navigation';
import { getSession, getStudentForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, ProgressBar, EmptyState } from '@/components/ui';
import { AttendanceChart, PerformanceChart } from '@/components/dashboard/Charts';
import {
  LayoutDashboard, CheckCircle2, FileText, Clock, GraduationCap,
  Bell, BookOpen, Calendar, Award, TrendingUp, ClipboardList,
} from 'lucide-react';
import { calculateGrade, formatDate, getAvatarUrl } from '@/lib/utils';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/student', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/student/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/student/attendance', label: 'Attendance', icon: 'check-circle' },
  { href: '/portal/student/assignments', label: 'Assignments', icon: 'book-open' },
  { href: '/portal/student/exams', label: 'Exams & Results', icon: 'graduation-cap' },
  { href: '/portal/student/notices', label: 'Notices', icon: 'bell' },
];

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') redirect('/login');

  const student = await getStudentForUser(session.id);
  if (!student) redirect('/login');

  const [attendance, marks, assignments, upcomingExams, notices, events] = await Promise.all([
    prisma.attendance.findMany({ where: { studentId: student.id }, orderBy: { date: 'desc' } }),
    prisma.mark.findMany({
      where: { studentId: student.id },
      include: { examSubject: { include: { subject: true, exam: true } } },
    }),
    prisma.studentAssignment.findMany({
      where: { studentId: student.id },
      include: { assignment: { include: { subject: true } } },
      orderBy: { assignment: { dueDate: 'asc' } },
    }),
    prisma.exam.findMany({
      where: { isPublished: false },
      include: { examSubjects: { include: { subject: true } } },
      orderBy: { startDate: 'asc' },
    }),
    prisma.notice.findMany({ orderBy: { publishDate: 'desc' }, take: 5 }),
    prisma.event.findMany({ where: { startDate: { gte: new Date() } }, orderBy: { startDate: 'asc' }, take: 3 }),
  ]);

  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const attendancePct = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0;

  const totalMarks = marks.reduce((sum, m) => sum + m.internalMarks + m.examMarks, 0);
  const maxTotal = marks.reduce((sum, m) => sum + m.examSubject.maxMarks, 0);
  const overallPct = maxTotal > 0 ? Math.round((totalMarks / maxTotal) * 100) : 0;
  const overallGrade = calculateGrade(overallPct);

  const pendingAssignments = assignments.filter(a => a.status === 'Pending');

  const quickAccess = [
    { label: 'Timetable', icon: Clock, href: '/portal/student/timetable', color: 'bg-purple-50 text-purple-600' },
    { label: 'Attendance', icon: CheckCircle2, href: '/portal/student/attendance', color: 'bg-green-50 text-green-600' },
    { label: 'Assignments', icon: BookOpen, href: '/portal/student/assignments', color: 'bg-blue-50 text-blue-600' },
    { label: 'Exams', icon: GraduationCap, href: '/portal/student/exams', color: 'bg-gold-50 text-gold-600' },
    { label: 'Notices', icon: Bell, href: '/portal/student/notices', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="STUDENT" basePath="/portal/student" notifications={notices.length}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Welcome, {session.name} 👋</h1>
        <p className="text-sm text-navy-500 mt-1">Here&apos;s your academic overview.</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img src={getAvatarUrl(session.name)} alt={session.name} className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-navy-900">{session.name}</h2>
            <div className="mt-1 flex flex-wrap gap-3 text-sm text-navy-500">
              <span>ID: <strong className="text-navy-700">{student.admissionNo}</strong></span>
              <span>Class: <strong className="text-navy-700">{student.class.name} - {student.section.name}</strong></span>
              <span>Roll No: <strong className="text-navy-700">{student.rollNumber}</strong></span>
              <span>Year: <strong className="text-navy-700">{student.academicYear.year}</strong></span>
            </div>
          </div>
        </div>
      </Card>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-navy-500">Attendance</p>
              <p className="text-2xl font-bold text-navy-900 mt-1">{attendancePct}%</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <ProgressBar value={attendancePct} color={attendancePct >= 75 ? 'green' : 'red'} className="mt-3" />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-navy-500">Overall Grade</p>
              <p className="text-2xl font-bold text-navy-900 mt-1">{overallGrade}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
              <Award className="h-5 w-5 text-gold-600" />
            </div>
          </div>
          <p className="text-xs text-navy-400 mt-3">{overallPct}% overall score</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-navy-500">Pending Tasks</p>
              <p className="text-2xl font-bold text-navy-900 mt-1">{pendingAssignments.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-navy-400 mt-3">Assignments due</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-navy-500">Next Exam</p>
              <p className="text-lg font-bold text-navy-900 mt-1">
                {upcomingExams.length > 0 ? upcomingExams[0].name : 'None'}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          {upcomingExams.length > 0 && <p className="text-xs text-navy-400 mt-3">{formatDate(upcomingExams[0].startDate)}</p>}
        </Card>
      </div>

      {/* Quick Access */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-navy-700 mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900">Academic Performance</h3>
            <TrendingUp className="h-5 w-5 text-navy-400" />
          </div>
          <PerformanceChart marks={marks} />
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {notices.slice(0, 4).map(notice => (
              <div key={notice.id} className="border-b border-navy-50 pb-3 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-navy-900">{notice.title}</p>
                  {notice.priority === 'High' && <Badge variant="danger">High</Badge>}
                </div>
                <p className="text-xs text-navy-400 mt-1">{formatDate(notice.publishDate)}</p>
              </div>
            ))}
            {notices.length === 0 && <p className="text-sm text-navy-400">No notices available.</p>}
          </div>
        </Card>
      </div>

      {/* Pending Assignments */}
      <Card className="mt-6 p-6">
        <h3 className="font-semibold text-navy-900 mb-4">Pending Assignments</h3>
        {pendingAssignments.length === 0 ? (
          <EmptyState icon={ClipboardList} title="All Caught Up!" description="You have no pending assignments." />
        ) : (
          <div className="space-y-3">
            {pendingAssignments.map(sa => (
              <div key={sa.id} className="flex items-center justify-between border-b border-navy-50 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy-900">{sa.assignment.title}</p>
                  <p className="text-xs text-navy-500">{sa.assignment.subject.name}</p>
                </div>
                <div className="text-right">
                  <Badge variant="warning">Due</Badge>
                  <p className="text-xs text-navy-400 mt-1">{formatDate(sa.assignment.dueDate)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}
