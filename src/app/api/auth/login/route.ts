import { NextResponse } from 'next/server';
import { authenticate, createSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['PARENT', 'STUDENT', 'STAFF', 'ADMIN']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = schema.parse(body);

    let user;
    try {
      user = await authenticate(email, password);
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      return NextResponse.json(
        { error: 'Unable to connect to the server. Please try again.' },
        { status: 503 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    if (user.role !== role) {
      return NextResponse.json(
        { error: `This account is not a ${role.toLowerCase()} account. Please select the correct role.` },
        { status: 403 }
      );
    }

    let token;
    try {
      token = await createSession(user.id);
    } catch (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Unable to connect to the server. Please try again.' },
        { status: 503 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE / 1000,
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Unexpected login error:', error);
    return NextResponse.json(
      { error: 'Unable to connect to the server. Please try again.' },
      { status: 500 }
    );
  }
}
