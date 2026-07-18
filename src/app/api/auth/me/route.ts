import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/shared/lib/auth/session';
import { AUTH_COOKIE_NAME } from '@/shared/lib/auth/constants';

// ─── GET /api/auth/me ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, admin: null, error: 'Not authenticated' },
        { status: 200 }
      );
    }

    const payload = await validateSession(token);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false, admin: null, error: 'Session invalid or expired' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
