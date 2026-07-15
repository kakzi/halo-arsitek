import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { JWT_EXPIRATION_SECONDS } from './constants';

/** Custom JWT payload for admin sessions */
export interface AdminJWTPayload extends JWTPayload {
  sub: string; // admin ID
  email: string;
  name: string;
  role: string;
  sessionId: string;
}

/**
 * Get the JWT secret key as a Uint8Array.
 * Using jose (Edge-compatible) instead of jsonwebtoken (Node-only).
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be set in environment variables and be at least 32 characters.'
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Sign a JWT token for an authenticated admin.
 * Token includes admin info + session ID for revocation support.
 */
export async function signJWT(payload: Omit<AdminJWTPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = getJWTSecret();

  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRATION_SECONDS}s`)
    .setIssuer('haloarsitek-cms')
    .setAudience('haloarsitek-admin')
    .sign(secret);
}

/**
 * Verify and decode a JWT token.
 * Returns null if invalid, expired, or tampered.
 */
export async function verifyJWT(token: string): Promise<AdminJWTPayload | null> {
  try {
    const secret = getJWTSecret();
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'haloarsitek-cms',
      audience: 'haloarsitek-admin',
    });
    return payload as AdminJWTPayload;
  } catch {
    return null;
  }
}
