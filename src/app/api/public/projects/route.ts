import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// ─── GET /api/public/projects ────────────────────────────────────────────────
// Public endpoint — returns only published projects (no auth required)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const headlinerOnly = searchParams.get('headliner') === 'true';

    const selectFields = {
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
      isHeadliner: true,
    };

    let projects = await prisma.project.findMany({
      where: headlinerOnly ? { isPublished: true, isHeadliner: true } : { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { year: 'desc' }],
      select: selectFields,
    });

    // Fallback to all published projects if headliner=true returned no projects
    if (headlinerOnly && projects.length === 0) {
      projects = await prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { year: 'desc' }],
        select: selectFields,
      });
    }

    return NextResponse.json({ data: projects }, {
      headers: {
        'Cache-Control': headlinerOnly ? 'no-store' : 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Public projects error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
