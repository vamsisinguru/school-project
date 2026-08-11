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

  return NextResponse.json({
    subjects: subjects.map(s => ({ id: s.id, name: s.name, className: s.class.name, classId: s.classId })),
  });
}
