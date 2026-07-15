import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { verifyPassword } from '@/shared/lib/auth/password';
import { createSession } from '@/shared/lib/auth/session';
import { AUTH_COOKIE_NAME, COOKIE_OPTIONS } from '@/shared/lib/auth/constants';
import { z } from 'zod';

// ─── Rate Limiting (in-memory for simplicity) ────────────────────────────────
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }

  entry.count++;
  if (entry.count > 5) return true;
  return false;
}

function clearRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

// ─── Validation Schema ──────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Input tidak valid', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        isActive: true,
      },
    });

    // Use constant-time response to prevent user enumeration
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, admin.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Clear rate limit on successful login
    clearRateLimit(ip);

    // Create session and JWT
    const userAgent = request.headers.get('user-agent') || undefined;
    const token = await createSession(
      { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
      ip,
      userAgent
    );

    // Set HttpOnly cookie with JWT
    const response = NextResponse.json(
      {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
