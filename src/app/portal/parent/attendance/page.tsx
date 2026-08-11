import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { AttendanceChart } from '@/components/dashboard/Charts';
import { CheckCircle2, XCircle, Clock as ClockIcon, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/parent', label: 'Overview', icon: CheckCircle2 },
  { href: '/portal/parent/attendance', label: 'Attendance', icon: CheckCircle2 },
  { href: '/portal/parent/report-card', label: 'Report Card', icon: FileText },
  { href: '/portal/parent/timetable', label: 'Timetable', icon: Clock },
  { href: '/portal/parent/exams', label: 'Exams', icon: GraduationCap },
  { href: '/portal/parent/notices', label: 'Notices', icon: Bell },
];

import { FileText, Clock, GraduationCap, Bell } from 'lucide-react';

export default async function ParentAttendancePage() {
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
  const attendance = await prisma.attendance.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' },
  });

  const present = attendance.filter(a => a.status === 'PRESENT').length;
  const absent = attendance.filter(a => a.status === 'ABSENT').length;
  const late = attendance.filter(a => a.status === 'LATE').length;
  const total = attendance.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  // Group by month
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
    <DashboardShell navItems={navItems} userName={session.name} userRole="PARENT" basePath="/portal/parent">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Attendance</h1>
        <p className="text-sm text-navy-500 mt-1">{student.user.name} - {student.class.name} {student.section.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">{present}</p>
              <p className="text-xs text-navy-500">Present Days</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">{absent}</p>
              <p className="text-xs text-navy-500">Absent Days</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <ClockIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">{late}</p>
              <p className="text-xs text-navy-500">Late Days</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
              <Calendar className="h-5 w-5 text-navy-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">{pct}%</p>
              <p className="text-xs text-navy-500">Attendance Rate</p>
            </div>
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
                <div className="flex gap-3 mt-1 text-xs text-navy-400">
                  <span>P: {data.present}</span>
                  <span>A: {data.absent}</span>
                  <span>L: {data.late}</span>
                </div>
              </div>
            ))}
            {Object.keys(monthlyData).length === 0 && <p className="text-sm text-navy-400">No data available.</p>}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="font-semibold text-navy-900 mb-4">Recent Attendance Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100">
                <th className="text-left py-2 px-3 font-medium text-navy-600">Date</th>
                <th className="text-left py-2 px-3 font-medium text-navy-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {attendance.slice(0, 20).map(a => (
                <tr key={a.id} className="hover:bg-navy-50/50">
                  <td className="py-2 px-3 text-navy-700">{formatDate(a.date)}</td>
                  <td className="py-2 px-3">
                    <Badge variant={a.status === 'PRESENT' ? 'success' : a.status === 'ABSENT' ? 'danger' : 'warning'}>
                      {a.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
