// ─── AUTH CONSTANTS ─────────────────────────────────────────────────────────

/** Name of the HttpOnly cookie storing the JWT access token */
export const AUTH_COOKIE_NAME = 'haloarsitek_session';

/** JWT expiration time in seconds (7 days) */
export const JWT_EXPIRATION_SECONDS = 7 * 24 * 60 * 60;

/** Maximum login attempts before rate limiting */
export const MAX_LOGIN_ATTEMPTS = 5;

/** Rate limit window in milliseconds (15 minutes) */
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** bcrypt cost factor */
export const BCRYPT_COST_FACTOR = 12;

/** Routes that don't require authentication */
export const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

/** Cookie options for auth token */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: JWT_EXPIRATION_SECONDS,
};
