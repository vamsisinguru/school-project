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

  const staffList = await prisma.staff.findMany({
    include: { user: true },
    orderBy: { joiningDate: 'asc' },
  });

  return NextResponse.json({
    staff: staffList.map(s => ({
      id: s.id,
      name: s.user.name,
      email: s.user.email,
      employeeId: s.employeeId,
      designation: s.designation,
      qualification: s.qualification,
      isAdmin: s.isAdmin,
      canManageTimetable: s.canManageTimetable,
      canManageNotices: s.canManageNotices,
      canManageEvents: s.canManageEvents,
    })),
  });
}
