import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(255),
  slug: z.string().min(1, 'Slug wajib diisi').max(255).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  description: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const categories = await prisma.newsCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('Get news categories error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.newsCategory.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
    }

    const category = await prisma.newsCategory.create({
      data: validation.data,
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error('Create news category error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
