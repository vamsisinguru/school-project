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

  // Get classes and sections for subjects this staff teaches
  const subjects = await prisma.subject.findMany({
    where: { staffId: staff.id },
    include: { class: { include: { sections: true } } },
  });

  const classIds = [...new Set(subjects.map(s => s.classId))];

  const students = await prisma.student.findMany({
    where: { classId: { in: classIds } },
    include: { user: true, class: true, section: true },
    orderBy: [{ class: { name: 'asc' } }, { rollNumber: 'asc' }],
  });

  const classes = subjects.map(s => s.class);
  const sections = subjects.flatMap(s => s.class.sections).map(sec => ({ id: sec.id, name: sec.name, className: classes.find(c => c.id === sec.classId)?.name || '' }));

  return NextResponse.json({
    students: students.map(s => ({
      id: s.id,
      name: s.user.name,
      rollNumber: s.rollNumber,
      admissionNo: s.admissionNo,
      className: s.class.name,
      sectionName: s.section.name,
      gender: s.gender,
    })),
    classes: classes.map(c => ({ id: c.id, name: c.name, level: c.level })),
    sections,
  });
}
