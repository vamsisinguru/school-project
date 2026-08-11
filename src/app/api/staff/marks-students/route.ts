import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('subjectId');
  const examId = searchParams.get('examId');

  if (!subjectId || !examId) {
    return NextResponse.json({ error: 'Subject and Exam IDs required' }, { status: 400 });
  }

  // Verify staff teaches this subject
  const subject = await prisma.subject.findFirst({ where: { id: subjectId, staffId: staff.id } });
  if (!subject) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  // Get exam subject
  const examSubject = await prisma.examSubject.findFirst({
    where: { subjectId, examId },
  });

  if (!examSubject) return NextResponse.json({ error: 'Exam subject not found' }, { status: 404 });

  const students = await prisma.student.findMany({
    where: { classId: subject.classId },
    include: { user: true },
    orderBy: { rollNumber: 'asc' },
  });

  const existingMarks = await prisma.mark.findMany({
    where: { examSubjectId: examSubject.id },
  });

  return NextResponse.json({
    students: students.map(s => ({ id: s.id, name: s.user.name, rollNumber: s.rollNumber })),
    existingMarks: existingMarks.map(m => ({
      studentId: m.studentId,
      internalMarks: m.internalMarks,
      examMarks: m.examMarks,
      remarks: m.remarks,
    })),
    maxMarks: examSubject.maxMarks,
  });
}
