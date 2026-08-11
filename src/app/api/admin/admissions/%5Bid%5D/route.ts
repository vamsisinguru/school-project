import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff || !staff.isAdmin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const schema = z.object({ status: z.enum(['Pending', 'Approved', 'Rejected']) });
    const { status } = schema.parse(body);

    const admission = await prisma.admission.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true, admission });
  } catch {
    return NextResponse.json({ error: 'Failed to update admission' }, { status: 500 });
  }
}
