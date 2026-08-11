import { NextResponse } from 'next/server';
import { getSession, getStaffForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staff = await getStaffForUser(session.id);
  if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

  const events = await prisma.event.findMany({ orderBy: { startDate: 'desc' } });

  return NextResponse.json({
    events: events.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      category: e.category,
      startDate: e.startDate.toISOString(),
      venue: e.venue,
      imageUrl: e.imageUrl,
    })),
    canManage: staff.canManageEvents || staff.isAdmin,
  });
}

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string(),
  startDate: z.string(),
  venue: z.string().optional(),
  imageUrl: z.string().optional(),
});

export async function POST(req: Request) {
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
    const data = schema.parse(body);

    const event = await prisma.event.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        createdBy: session.id,
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
