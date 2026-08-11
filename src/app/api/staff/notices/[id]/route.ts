import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff || !(staff.canManageNotices || staff.isAdmin)) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const schema = z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      category: z.string(),
      priority: z.string(),
    });
    const data = schema.parse(body);

    const notice = await prisma.notice.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, notice });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff || !(staff.canManageNotices || staff.isAdmin)) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    await prisma.notice.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
  }
}
