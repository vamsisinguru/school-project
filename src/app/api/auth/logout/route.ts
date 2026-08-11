import { NextResponse } from 'next/server';
import { destroySession, SESSION_COOKIE } from '@/lib/auth';

export async function POST() {
  await destroySession();

  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
