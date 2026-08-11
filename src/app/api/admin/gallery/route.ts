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

  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });

  return NextResponse.json({
    items: items.map(i => ({
      id: i.id,
      title: i.title,
      category: i.category,
      imageUrl: i.imageUrl,
      description: i.description,
    })),
  });
}

const schema = z.object({
  title: z.string().min(1),
  category: z.string(),
  imageUrl: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: Request) {
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
    const data = schema.parse(body);

    const item = await prisma.galleryItem.create({ data });

    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 });
  }
}
