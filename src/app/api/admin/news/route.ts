import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const createNewsSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255),
  slug: z.string().min(1, 'Slug wajib diisi').max(255).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  categoryId: z.string().min(1, 'Kategori wajib diisi'),
  content: z.string().min(1, 'Konten wajib diisi'),
  coverImage: z.string().min(1, 'Cover image wajib diisi').max(500),
  isPublished: z.boolean().default(false),
});

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
      where.title = { contains: search };
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      data: news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = createNewsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.news.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug sudah digunakan' },
        { status: 409 }
      );
    }

    const news = await prisma.news.create({
      data: validation.data,
      include: { category: true },
    });

    return NextResponse.json({ data: news }, { status: 201 });
  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
