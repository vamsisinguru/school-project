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

  const notices = await prisma.notice.findMany({ orderBy: { publishDate: 'desc' } });

  return NextResponse.json({
    notices: notices.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      category: n.category,
      priority: n.priority,
      publishDate: n.publishDate.toISOString(),
    })),
    canManage: staff.canManageNotices || staff.isAdmin,
  });
}

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string(),
  priority: z.string(),
});

export async function POST(req: Request) {
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
    const data = schema.parse(body);

    const notice = await prisma.notice.create({
      data: { ...data, createdBy: session.id },
    });

    return NextResponse.json({ success: true, notice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}
