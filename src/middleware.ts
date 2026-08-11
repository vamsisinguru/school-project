import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/about', '/academics', '/facilities', '/admissions', '/gallery', '/events', '/contact', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and API routes
  if (publicPaths.some(p => pathname === p) || pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Protect portal routes
  if (pathname.startsWith('/portal')) {
    const token = request.cookies.get('sc_session')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};
