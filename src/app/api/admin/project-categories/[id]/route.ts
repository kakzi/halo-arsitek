import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const updateCategorySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const category = await prisma.projectCategory.findUnique({ where: { id } });

    if (!category) {
      return NextResponse.json({ error: 'Category tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error('Get project category error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.projectCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Category tidak ditemukan' }, { status: 404 });
    }

    if (validation.data.slug && validation.data.slug !== existing.slug) {
      const slugExists = await prisma.projectCategory.findUnique({
        where: { slug: validation.data.slug },
      });
      if (slugExists) {
        return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
      }
    }

    const category = await prisma.projectCategory.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({ data: category });
  } catch (error) {
    console.error('Update project category error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.projectCategory.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Category tidak ditemukan' }, { status: 404 });
    }

    const projectCount = await prisma.project.count({ where: { categoryId: id } });
    if (projectCount > 0) {
      return NextResponse.json({ error: 'Category tidak bisa dihapus karena masih memiliki project' }, { status: 400 });
    }

    await prisma.projectCategory.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Category berhasil dihapus' });
  } catch (error) {
    console.error('Delete project category error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
