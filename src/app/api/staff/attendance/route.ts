import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  subjectId: z.string(),
  date: z.string(),
  attendance: z.record(z.string()),
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
    const { subjectId, date, attendance } = schema.parse(body);

    // Verify staff teaches this subject
    const subject = await prisma.subject.findFirst({ where: { id: subjectId, staffId: staff.id } });
    if (!subject) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Delete existing attendance for this date/subject
    await prisma.attendance.deleteMany({
      where: { subjectId, date: { gte: dayStart, lte: dayEnd } },
    });

    // Create new attendance records
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      date: dayStart,
      status: status as string,
      subjectId,
      markedBy: staff.id,
    }));

    if (records.length > 0) {
      await prisma.attendance.createMany({ data: records });
    }

    return NextResponse.json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}
