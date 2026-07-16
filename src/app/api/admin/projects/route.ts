import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

// ─── Validation Schemas ─────────────────────────────────────────────────────

const createProjectSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255),
  slug: z.string().min(1, 'Slug wajib diisi').max(255).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  categoryId: z.string().min(1, 'Kategori wajib diisi'),
  year: z.number().int().min(1900).max(2100),
  location: z.string().min(1).max(255),
  area: z.string().min(1).max(100),
  description: z.string().min(1),
  coverImage: z.string().min(1).max(500),
  images: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

// ─── GET /api/admin/projects ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId');
    const published = searchParams.get('published');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (published !== null && published !== undefined && published !== '') {
      where.isPublished = published === 'true';
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: { category: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── POST /api/admin/projects ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.project.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug sudah digunakan' },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: validation.data,
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
