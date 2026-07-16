import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, requireRole, isAuthError } from '@/shared/lib/auth';
import { hashPassword } from '@/shared/lib/auth/password';
import { z } from 'zod';

const updateAdminSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['SUPER_ADMIN', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

// ─── GET /api/admin/admins/[id] ──────────────────────────────────────────────

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireRole(request, ['SUPER_ADMIN']);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const admin = await prisma.admin.findUnique({
      where: { id },
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
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    return NextResponse.json({ data: admin });
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── PUT /api/admin/admins/[id] ──────────────────────────────────────────────

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireRole(request, ['SUPER_ADMIN']);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateAdminSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.admin.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    const { name, email, password, role, isActive } = validation.data;

    // Check email uniqueness if changed
    if (email && email.toLowerCase().trim() !== existing.email.toLowerCase().trim()) {
      const emailExists = await prisma.admin.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Email is already in use by another account' }, { status: 409 });
      }
    }

    // Handle optional password reset
    let passwordHash = existing.passwordHash;
    if (password && password.trim().length >= 6) {
      passwordHash = await hashPassword(password.trim());
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        email: email !== undefined ? email.toLowerCase().trim() : existing.email,
        passwordHash,
        role: role !== undefined ? role : existing.role,
        isActive: isActive !== undefined ? isActive : existing.isActive,
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

    return NextResponse.json({ data: updated, message: 'Admin account updated successfully' });
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── DELETE /api/admin/admins/[id] ───────────────────────────────────────────

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireRole(request, ['SUPER_ADMIN']);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;

    if (id === auth.admin.sub) {
      return NextResponse.json(
        { error: 'You cannot delete your own logged-in account' },
        { status: 400 }
      );
    }

    const existing = await prisma.admin.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    const totalAdmins = await prisma.admin.count();
    if (totalAdmins <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the only remaining admin account' },
        { status: 400 }
      );
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Admin account deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
