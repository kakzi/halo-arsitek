import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from './session';
import { AUTH_COOKIE_NAME } from './constants';
import type { AdminJWTPayload } from './jwt';

/**
 * Validate the admin session from an API request.
 * Returns the admin payload if valid, or a 401 response.
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ admin: AdminJWTPayload } | { error: NextResponse }> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized — no session token' },
        { status: 401 }
      ),
    };
  }

  const admin = await validateSession(token);

  if (!admin) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized — invalid or expired session' },
        { status: 401 }
      ),
    };
  }

  return { admin };
}

/**
 * Check if a requireAuth result is an error.
 */
export function isAuthError(
  result: { admin: AdminJWTPayload } | { error: NextResponse }
): result is { error: NextResponse } {
  return 'error' in result;
}
