import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// ─── GET /api/public/projects ────────────────────────────────────────────────
// Public endpoint — returns only published projects (no auth required)

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { year: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        year: true,
        location: true,
        area: true,
        description: true,
        coverImage: true,
        images: true,
      },
    });

    return NextResponse.json({ data: projects }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Public projects error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
