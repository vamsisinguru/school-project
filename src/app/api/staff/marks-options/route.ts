import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

  const subjects = await prisma.subject.findMany({
    where: { staffId: staff.id },
    include: { class: true },
  });

  const exams = await prisma.exam.findMany({
    include: {
      examSubjects: {
        where: { subjectId: { in: subjects.map(s => s.id) } },
      },
    },
    orderBy: { startDate: 'desc' },
  });

  return NextResponse.json({
    subjects: subjects.map(s => ({ id: s.id, name: s.name, className: s.class.name, classId: s.classId })),
    exams: exams.map(e => ({
      id: e.id,
      name: e.name,
      examType: e.examType,
      isPublished: e.isPublished,
      subjectIds: e.examSubjects.map(es => es.subjectId),
    })),
  });
}
