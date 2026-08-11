import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff || !staff.isAdmin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const admissions = await prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });

  return NextResponse.json({
    admissions: admissions.map(a => ({
      id: a.id,
      studentName: a.studentName,
      parentName: a.parentName,
      email: a.email,
      phone: a.phone,
      applyingClass: a.applyingClass,
      message: a.message,
      status: a.status,
      createdAt: a.createdAt.toISOString(),
    })),
  });
}
