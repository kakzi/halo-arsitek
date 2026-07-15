import { prisma } from '@/shared/lib/prisma';
import { signJWT, verifyJWT, type AdminJWTPayload } from './jwt';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

/**
 * Hash a token for storage in the database.
 * We never store raw JWTs — only their SHA-256 hash.
 */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Create a new session for an authenticated admin.
 * Generates a JWT and stores a hashed reference in the database.
 */
export async function createSession(
  admin: { id: string; email: string; name: string; role: string },
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const sessionId = uuidv4();

  // Sign the JWT with session context
  const token = await signJWT({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    sessionId,
  });

  // Store session in database for revocation tracking
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.session.create({
    data: {
      id: sessionId,
      adminId: admin.id,
      tokenHash: hashToken(token),
      expiresAt,
      ipAddress: ipAddress || null,
      userAgent: userAgent ? userAgent.substring(0, 512) : null,
    },
  });

  // Update admin last login
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  return token;
}

/**
 * Validate a session token.
 * Checks both JWT validity AND database session existence.
 */
export async function validateSession(token: string): Promise<AdminJWTPayload | null> {
  // 1. Verify JWT signature and expiration
  const payload = await verifyJWT(token);
  if (!payload) return null;

  // 2. Check if session still exists in database (not revoked)
  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // Clean up expired session
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  // 3. Verify admin is still active
  const admin = await prisma.admin.findUnique({
    where: { id: payload.sub },
    select: { isActive: true },
  });

  if (!admin || !admin.isActive) return null;

  return payload;
}

/**
 * Revoke a specific session (logout).
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: { id: sessionId },
  }).catch(() => {
    // Session may already be deleted, ignore
  });
}

/**
 * Revoke all sessions for an admin (force logout everywhere).
 */
export async function revokeAllSessions(adminId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { adminId },
  });
}

/**
 * Clean up expired sessions (housekeeping).
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
  return result.count;
}
