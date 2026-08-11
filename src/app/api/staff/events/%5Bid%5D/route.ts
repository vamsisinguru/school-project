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
  if (!staff || !(staff.canManageEvents || staff.isAdmin)) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const schema = z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.string(),
      startDate: z.string(),
      venue: z.string().optional(),
      imageUrl: z.string().optional(),
    });
    const data = schema.parse(body);

    const event = await prisma.event.update({
      where: { id: params.id },
      data: { ...data, startDate: new Date(data.startDate) },
    });

    return NextResponse.json({ success: true, event });
  } catch {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff || !(staff.canManageEvents || staff.isAdmin)) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
