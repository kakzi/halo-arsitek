import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true, description: true, icon: true },
    });
    return NextResponse.json({ data: services }, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' } });
  } catch (error) {
    console.error('Public services error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
