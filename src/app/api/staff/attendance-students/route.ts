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
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  if (!subjectId) return NextResponse.json({ error: 'Subject ID required' }, { status: 400 });

  // Verify staff teaches this subject
  const subject = await prisma.subject.findFirst({ where: { id: subjectId, staffId: staff.id } });
  if (!subject) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const students = await prisma.student.findMany({
    where: { classId: subject.classId },
    include: { user: true, class: true, section: true },
    orderBy: { rollNumber: 'asc' },
  });

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const existingAttendance = await prisma.attendance.findMany({
    where: {
      studentId: { in: students.map(s => s.id) },
      date: { gte: dayStart, lte: dayEnd },
      subjectId,
    },
  });

  return NextResponse.json({
    students: students.map(s => ({
      id: s.id,
      name: s.user.name,
      rollNumber: s.rollNumber,
      className: s.class.name,
      sectionName: s.section.name,
    })),
    existingAttendance: existingAttendance.map(a => ({ studentId: a.studentId, status: a.status })),
  });
}
