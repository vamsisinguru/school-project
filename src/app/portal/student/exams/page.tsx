import { redirect } from 'next/navigation';
import { getSession, getStudentForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, EmptyState } from '@/components/ui';
import { ProgressChart } from '@/components/dashboard/Charts';
import { LayoutDashboard, CheckCircle2, Clock, GraduationCap, Bell, BookOpen, Calendar, Award } from 'lucide-react';
import { formatDate, calculateGrade } from '@/lib/utils';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/student', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/student/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/student/attendance', label: 'Attendance', icon: 'check-circle' },
  { href: '/portal/student/assignments', label: 'Assignments', icon: 'book-open' },
  { href: '/portal/student/exams', label: 'Exams & Results', icon: 'graduation-cap' },
  { href: '/portal/student/notices', label: 'Notices', icon: 'bell' },
];

export default async function StudentExamsPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') redirect('/login');

  const student = await getStudentForUser(session.id);
  if (!student) redirect('/login');

  const [upcomingExams, publishedExams] = await Promise.all([
    prisma.exam.findMany({
      where: { isPublished: false },
      include: { examSubjects: { include: { subject: true }, orderBy: { examDate: 'asc' } } },
      orderBy: { startDate: 'asc' },
    }),
    prisma.exam.findMany({
      where: { isPublished: true },
      include: { examSubjects: { include: { subject: true, marks: { where: { studentId: student.id } } } } },
      orderBy: { startDate: 'desc' },
    }),
  ]);

  const progressData = publishedExams.map(exam => {
    const examMarks = exam.examSubjects.reduce((sum, es) => {
      const mark = es.marks[0];
      return sum + (mark ? mark.internalMarks + mark.examMarks : 0);
    }, 0);
    const maxTotal = exam.examSubjects.reduce((sum, es) => sum + es.maxMarks, 0);
    return { exam: exam.name.slice(0, 15), percentage: maxTotal > 0 ? Math.round((examMarks / maxTotal) * 100) : 0 };
  }).reverse();

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="STUDENT" basePath="/portal/student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Exams & Results</h1>
        <p className="text-sm text-navy-500 mt-1">{student.class.name} - {student.section.name}</p>
      </div>

      <h2 className="text-lg font-semibold text-navy-900 mb-4">Upcoming Examinations</h2>
      {upcomingExams.length === 0 ? (
        <Card className="mb-6"><EmptyState icon={Calendar} title="No Upcoming Exams" description="No exams scheduled at this time." /></Card>
      ) : (
        <div className="space-y-4 mb-8">
          {upcomingExams.map(exam => (
            <Card key={exam.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div><h3 className="font-semibold text-navy-900">{exam.name}</h3><p className="text-sm text-navy-500">{exam.examType}</p></div>
                <Badge variant="info">{formatDate(exam.startDate)} - {formatDate(exam.endDate)}</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {exam.examSubjects.map(es => (
                  <div key={es.id} className="rounded-lg bg-navy-50 px-3 py-2">
                    <p className="text-sm font-medium text-navy-900">{es.subject.name}</p>
                    <p className="text-xs text-navy-500">{formatDate(es.examDate)} • Max: {es.maxMarks}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {progressData.length > 0 && (
        <Card className="mb-8 p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Academic Progress</h3>
          <ProgressChart data={progressData} />
        </Card>
      )}

      <h2 className="text-lg font-semibold text-navy-900 mb-4">Past Results</h2>
      {publishedExams.length === 0 ? (
        <Card><EmptyState icon={Award} title="No Results" description="No exam results published yet." /></Card>
      ) : (
        <div className="space-y-4">
          {publishedExams.map(exam => {
            const totalMarks = exam.examSubjects.reduce((sum, es) => {
              const mark = es.marks[0];
              return sum + (mark ? mark.internalMarks + mark.examMarks : 0);
            }, 0);
            const maxTotal = exam.examSubjects.reduce((sum, es) => sum + es.maxMarks, 0);
            const pct = maxTotal > 0 ? Math.round((totalMarks / maxTotal) * 100) : 0;
            const grade = calculateGrade(pct);

            return (
              <Card key={exam.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div><h3 className="font-semibold text-navy-900">{exam.name}</h3><p className="text-xs text-navy-500">{formatDate(exam.startDate)} - {formatDate(exam.endDate)}</p></div>
                  <div className="text-right"><Badge variant={grade.startsWith('A') ? 'success' : 'warning'}>{grade}</Badge><p className="text-xs text-navy-500 mt-1">{pct}%</p></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-navy-100">
                      <th className="text-left py-2 font-medium text-navy-600">Subject</th>
                      <th className="text-center py-2 font-medium text-navy-600">Marks</th>
                      <th className="text-center py-2 font-medium text-navy-600">Max</th>
                      <th className="text-center py-2 font-medium text-navy-600">Grade</th>
                    </tr></thead>
                    <tbody className="divide-y divide-navy-50">
                      {exam.examSubjects.map(es => {
                        const mark = es.marks[0];
                        const total = mark ? mark.internalMarks + mark.examMarks : 0;
                        const sPct = (total / es.maxMarks) * 100;
                        return (
                          <tr key={es.id}>
                            <td className="py-2 text-navy-700">{es.subject.name}</td>
                            <td className="py-2 text-center font-medium text-navy-900">{total}</td>
                            <td className="py-2 text-center text-navy-500">{es.maxMarks}</td>
                            <td className="py-2 text-center"><Badge variant={calculateGrade(sPct).startsWith('A') ? 'success' : 'warning'}>{calculateGrade(sPct)}</Badge></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
