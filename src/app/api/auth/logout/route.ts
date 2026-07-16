import { NextRequest, NextResponse } from 'next/server';
import { validateSession, revokeSession } from '@/shared/lib/auth/session';
import { AUTH_COOKIE_NAME } from '@/shared/lib/auth/constants';

// ─── POST /api/auth/logout ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      // Validate and get session info to revoke
      const payload = await validateSession(token);
      if (payload?.sessionId) {
        await revokeSession(payload.sessionId);
      }
    }

    // Clear the auth cookie
    const response = NextResponse.json(
      { success: true, message: 'Berhasil logout' },
      { status: 200 }
    );

    response.cookies.delete(AUTH_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear the cookie even if revocation fails
    const response = NextResponse.json(
      { success: true, message: 'Berhasil logout' },
      { status: 200 }
    );
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }
}
