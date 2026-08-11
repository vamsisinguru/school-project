import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  subjectId: z.string(),
  examId: z.string(),
  marks: z.record(z.object({
    internal: z.string(),
    exam: z.string(),
    remarks: z.string().optional(),
  })),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

  try {
    const body = await req.json();
    const { subjectId, examId, marks } = schema.parse(body);

    // Verify staff teaches this subject
    const subject = await prisma.subject.findFirst({ where: { id: subjectId, staffId: staff.id } });
    if (!subject) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const examSubject = await prisma.examSubject.findFirst({ where: { subjectId, examId } });
    if (!examSubject) return NextResponse.json({ error: 'Exam subject not found' }, { status: 404 });

    const maxInternal = 20;
    const maxExam = examSubject.maxMarks - maxInternal;

    // Upsert marks for each student
    for (const [studentId, markData] of Object.entries(marks)) {
      const internal = parseInt(markData.internal) || 0;
      const exam = parseInt(markData.exam) || 0;

      if (internal > maxInternal) {
        return NextResponse.json({ error: `Internal marks cannot exceed ${maxInternal}` }, { status: 400 });
      }
      if (exam > maxExam) {
        return NextResponse.json({ error: `Exam marks cannot exceed ${maxExam}` }, { status: 400 });
      }

      // Verify student belongs to this class
      const student = await prisma.student.findFirst({ where: { id: studentId, classId: subject.classId } });
      if (!student) continue;

      await prisma.mark.upsert({
        where: {
          studentId_examSubjectId: { studentId, examSubjectId: examSubject.id },
        },
        create: {
          studentId,
          examSubjectId: examSubject.id,
          internalMarks: internal,
          examMarks: exam,
          remarks: markData.remarks || null,
        },
        update: {
          internalMarks: internal,
          examMarks: exam,
          remarks: markData.remarks || null,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Marks saved successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save marks' }, { status: 500 });
  }
}
