import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const updateNewsSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  categoryId: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().min(1).max(500).optional(),
  isPublished: z.boolean().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!news) {
      return NextResponse.json({ error: 'News tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ data: news });
  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateNewsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'News tidak ditemukan' }, { status: 404 });
    }

    if (validation.data.slug && validation.data.slug !== existing.slug) {
      const slugExists = await prisma.news.findUnique({
        where: { slug: validation.data.slug },
      });
      if (slugExists) {
        return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
      }
    }

    const news = await prisma.news.update({
      where: { id },
      data: validation.data,
      include: { category: true },
    });

    return NextResponse.json({ data: news });
  } catch (error) {
    console.error('Update news error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.news.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'News tidak ditemukan' }, { status: 404 });
    }

    await prisma.news.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'News berhasil dihapus' });
  } catch (error) {
    console.error('Delete news error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
