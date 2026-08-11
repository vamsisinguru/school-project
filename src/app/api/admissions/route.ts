import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  studentName: z.string().min(1),
  parentName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  applyingClass: z.string().min(1),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await prisma.admission.create({ data });

    return NextResponse.json({ success: true, message: 'Admission enquiry submitted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
