import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, requireRole, isAuthError } from '@/shared/lib/auth';
import { hashPassword } from '@/shared/lib/auth/password';
import { z } from 'zod';

const createAdminSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN']).default('ADMIN'),
  isActive: z.boolean().default(true),
});

// ─── GET /api/admin/admins ───────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = await requireRole(request, ['SUPER_ADMIN']);
  if (isAuthError(auth)) return auth.error;

  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ data: admins });
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── POST /api/admin/admins ──────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ['SUPER_ADMIN']);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = createAdminSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, role, isActive } = validation.data;

    const existing = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const newAdmin = await prisma.admin.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        isActive,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: newAdmin, message: 'Admin account created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
