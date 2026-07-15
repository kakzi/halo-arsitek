import bcrypt from 'bcryptjs';
import { BCRYPT_COST_FACTOR } from './constants';

/**
 * Hash a plain-text password using bcrypt.
 * Cost factor 12 = ~250ms on modern hardware — good balance of security and speed.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_COST_FACTOR);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a plain-text password against a bcrypt hash.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
