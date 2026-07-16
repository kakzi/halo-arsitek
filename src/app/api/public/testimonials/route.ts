import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, quote: true, name: true, role: true, project: true },
    });
    return NextResponse.json({ data: testimonials }, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' } });
  } catch (error) {
    console.error('Public testimonials error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
