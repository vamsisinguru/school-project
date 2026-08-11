import { redirect } from 'next/navigation';
import { getSession, getStudentForParent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ParentDashboard } from '@/components/dashboard/ParentDashboard';

export const metadata = { robots: { index: false, follow: false } };

async function getParentData(userId: string) {
  const parent = await prisma.parent.findFirst({
    where: { userId },
    include: {
      children: {
        include: {
          student: {
            include: {
              user: true,
              class: true,
              section: true,
              academicYear: true,
            },
          },
        },
      },
    },
  });
  return parent;
}

async function getStudentDashboardData(studentId: string) {
  const [attendance, marks, upcomingExams, notices, events] = await Promise.all([
    prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
    }),
    prisma.mark.findMany({
      where: { studentId },
      include: { examSubject: { include: { subject: true, exam: true } } },
    }),
    prisma.exam.findMany({
      where: {
        isPublished: false,
        examSubjects: { some: { subject: { class: { students: { some: { id: studentId } } } } } },
      },
      include: { examSubjects: { include: { subject: true } } },
      orderBy: { startDate: 'asc' },
    }),
    prisma.notice.findMany({
      orderBy: { publishDate: 'desc' },
      take: 5,
    }),
    prisma.event.findMany({
      where: { startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      take: 3,
    }),
  ]);

  return { attendance, marks, upcomingExams, notices, events };
}

export default async function ParentDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'PARENT') redirect('/login');

  const parent = await getParentData(session.id);
  if (!parent) redirect('/login');

  const children = parent.children.map(c => ({
    id: c.student.id,
    name: c.student.user.name,
    rollNumber: c.student.rollNumber,
    admissionNo: c.student.admissionNo,
    className: c.student.class.name,
    sectionName: c.student.section.name,
    academicYear: c.student.academicYear.year,
    gender: c.student.gender ?? undefined,
    bloodGroup: c.student.bloodGroup ?? undefined,
    dateOfBirth: c.student.dateOfBirth ?? undefined,
  }));

  if (children.length === 0) {
    return (
      <ParentDashboard userName={session.name} studentChildren={[]} selectedChild={null} dashboardData={null} />
    );
  }

  const firstChildId = children[0].id;
  const dashboardData = await getStudentDashboardData(firstChildId);

  return (
    <ParentDashboard
      userName={session.name}
      studentChildren={children}
      selectedChild={children[0]}
      dashboardData={dashboardData}
    />
  );
}
