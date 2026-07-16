import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { hashPassword, verifyPassword } from '@/shared/lib/auth/password';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  email: z.string().email('Invalid email address').optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
});

// ─── GET /api/admin/profile ──────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: auth.admin.sub },
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
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ data: admin });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── PUT /api/admin/profile ──────────────────────────────────────────────────

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, currentPassword, newPassword } = validation.data;

    const existing = await prisma.admin.findUnique({
      where: { id: auth.admin.sub },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Check email uniqueness if email is changing
    if (email && email.toLowerCase().trim() !== existing.email.toLowerCase().trim()) {
      const emailExists = await prisma.admin.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Email is already in use by another admin' }, { status: 409 });
      }
    }

    // Handle password change if requested
    let passwordHash = existing.passwordHash;
    if (newPassword && newPassword.trim().length > 0) {
      if (!currentPassword || currentPassword.trim().length === 0) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password' },
          { status: 400 }
        );
      }

      const isCurrentValid = await verifyPassword(currentPassword, existing.passwordHash);
      if (!isCurrentValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      passwordHash = await hashPassword(newPassword.trim());
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: auth.admin.sub },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        email: email !== undefined ? email.toLowerCase().trim() : existing.email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      data: updatedAdmin,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
