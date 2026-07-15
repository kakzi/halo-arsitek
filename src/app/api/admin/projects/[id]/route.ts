import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

// ─── Validation Schema ─────────────────────────────────────────────────────

const updateProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  categoryId: z.string().min(1).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  location: z.string().min(1).max(255).optional(),
  area: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  coverImage: z.string().min(1).max(500).optional(),
  images: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

// ─── GET /api/admin/projects/[id] ────────────────────────────────────────────

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── PUT /api/admin/projects/[id] ────────────────────────────────────────────

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check if project exists
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (validation.data.slug && validation.data.slug !== existing.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: validation.data.slug },
      });
      if (slugExists) {
        return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── DELETE /api/admin/projects/[id] ─────────────────────────────────────────

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Project tidak ditemukan' }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Project berhasil dihapus' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
