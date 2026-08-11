import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff || !staff.isAdmin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const students = await prisma.student.findMany({
    include: { user: true, class: true, section: true, academicYear: true },
    orderBy: [{ class: { name: 'asc' } }, { rollNumber: 'asc' }],
  });

  const classes = await prisma.class.findMany({ orderBy: { name: 'asc' } });

  return NextResponse.json({
    students: students.map(s => ({
      id: s.id,
      name: s.user.name,
      email: s.user.email,
      admissionNo: s.admissionNo,
      rollNumber: s.rollNumber,
      className: s.class.name,
      sectionName: s.section.name,
      gender: s.gender,
      bloodGroup: s.bloodGroup,
      dateOfBirth: s.dateOfBirth?.toISOString(),
      address: s.address,
      academicYear: s.academicYear.year,
    })),
    classes: classes.map(c => ({ id: c.id, name: c.name })),
  });
}
