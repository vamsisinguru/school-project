import { NextResponse } from 'next/server';
import { getSession, getStudentForParent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'PARENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parent = await prisma.parent.findFirst({
    where: { userId: session.id },
    include: {
      children: {
        include: {
          student: { include: { user: true, class: true, section: true, academicYear: true } },
        },
      },
    },
  });

  if (!parent || parent.children.length === 0) {
    return NextResponse.json({ error: 'No children found' }, { status: 404 });
  }

  const student = parent.children[0].student;

  const marks = await prisma.mark.findMany({
    where: { studentId: student.id },
    include: {
      examSubject: {
        include: {
          subject: true,
          exam: true,
        },
      },
    },
  });

  const exams = await prisma.exam.findMany({
    where: { isPublished: true },
    orderBy: { startDate: 'desc' },
  });

  return NextResponse.json({
    student: {
      name: student.user.name,
      rollNumber: student.rollNumber,
      admissionNo: student.admissionNo,
      className: student.class.name,
      sectionName: student.section.name,
      academicYear: student.academicYear.year,
      parentName: session.name,
    },
    marks,
    exams,
  });
}
