import { NextResponse } from 'next/server';
import { getSession, getStudentForParent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'PARENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
  }

  // Verify this student belongs to this parent
  const student = await getStudentForParent(session.id, studentId);
  if (!student) {
    return NextResponse.json({ error: 'Unauthorized access to student data' }, { status: 403 });
  }

  const [attendance, marks, upcomingExams, notices, events] = await Promise.all([
    prisma.attendance.findMany({ where: { studentId }, orderBy: { date: 'desc' } }),
    prisma.mark.findMany({
      where: { studentId },
      include: { examSubject: { include: { subject: true, exam: true } } },
    }),
    prisma.exam.findMany({
      where: { isPublished: false },
      include: { examSubjects: { include: { subject: true } } },
      orderBy: { startDate: 'asc' },
    }),
    prisma.notice.findMany({ orderBy: { publishDate: 'desc' }, take: 5 }),
    prisma.event.findMany({ where: { startDate: { gte: new Date() } }, orderBy: { startDate: 'asc' }, take: 3 }),
  ]);

  return NextResponse.json({ attendance, marks, upcomingExams, notices, events });
}
