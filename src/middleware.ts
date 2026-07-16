import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, PUBLIC_ADMIN_ROUTES } from '@/shared/lib/auth/constants';
import { verifyJWT } from '@/shared/lib/auth/jwt';

/**
 * Next.js Edge Middleware — protects /admin/* routes.
 * Runs on the edge (no Node.js APIs) so we only verify JWT here,
 * full session validation happens in API routes.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow public admin routes (login page)
  if (PUBLIC_ADMIN_ROUTES.some((route) => pathname === route)) {
    // If already authenticated, redirect to dashboard
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT (edge-level check — lightweight, no DB call)
  const payload = await verifyJWT(token);

  if (!payload) {
    // Clear invalid cookie and redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  // Attach admin info to request headers for downstream usage
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-admin-id', payload.sub || '');
  requestHeaders.set('x-admin-email', payload.email);
  requestHeaders.set('x-admin-role', payload.role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
