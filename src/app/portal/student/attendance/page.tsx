import { redirect } from 'next/navigation';
import { getSession, getStudentForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { AttendanceChart } from '@/components/dashboard/Charts';
import { LayoutDashboard, CheckCircle2, Clock, GraduationCap, Bell, BookOpen, XCircle, Calendar } from 'lucide-react';
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

export default async function StudentAttendancePage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') redirect('/login');

  const student = await getStudentForUser(session.id);
  if (!student) redirect('/login');

  const attendance = await prisma.attendance.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' },
  });

  const present = attendance.filter(a => a.status === 'PRESENT').length;
  const absent = attendance.filter(a => a.status === 'ABSENT').length;
  const late = attendance.filter(a => a.status === 'LATE').length;
  const total = attendance.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  const monthlyData: Record<string, { present: number; absent: number; late: number; total: number }> = {};
  attendance.forEach(a => {
    const monthKey = new Date(a.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { present: 0, absent: 0, late: 0, total: 0 };
    monthlyData[monthKey].total++;
    if (a.status === 'PRESENT') monthlyData[monthKey].present++;
    else if (a.status === 'ABSENT') monthlyData[monthKey].absent++;
    else monthlyData[monthKey].late++;
  });

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="STUDENT" basePath="/portal/student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">My Attendance</h1>
        <p className="text-sm text-navy-500 mt-1">{student.class.name} - {student.section.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div><p className="text-2xl font-bold text-navy-900">{present}</p><p className="text-xs text-navy-500">Present</p></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div><p className="text-2xl font-bold text-navy-900">{absent}</p><p className="text-xs text-navy-500">Absent</p></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div><p className="text-2xl font-bold text-navy-900">{late}</p><p className="text-xs text-navy-500">Late</p></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
              <Calendar className="h-5 w-5 text-navy-600" />
            </div>
            <div><p className="text-2xl font-bold text-navy-900">{pct}%</p><p className="text-xs text-navy-500">Rate</p></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Attendance Distribution</h3>
          <AttendanceChart attendance={attendance} />
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Monthly Summary</h3>
          <div className="space-y-3">
            {Object.entries(monthlyData).map(([month, data]) => (
              <div key={month}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-navy-700">{month}</span>
                  <span className="text-navy-500">{Math.round((data.present / data.total) * 100)}%</span>
                </div>
                <ProgressBar value={data.present} max={data.total} color={data.present / data.total >= 0.75 ? 'green' : 'red'} />
              </div>
            ))}
            {Object.keys(monthlyData).length === 0 && <p className="text-sm text-navy-400">No data available.</p>}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="font-semibold text-navy-900 mb-4">Recent Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-navy-100">
              <th className="text-left py-2 px-3 font-medium text-navy-600">Date</th>
              <th className="text-left py-2 px-3 font-medium text-navy-600">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-navy-50">
              {attendance.slice(0, 20).map(a => (
                <tr key={a.id} className="hover:bg-navy-50/50">
                  <td className="py-2 px-3 text-navy-700">{formatDate(a.date)}</td>
                  <td className="py-2 px-3"><Badge variant={a.status === 'PRESENT' ? 'success' : a.status === 'ABSENT' ? 'danger' : 'warning'}>{a.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
