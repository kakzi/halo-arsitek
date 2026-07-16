import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, role: true, image: true },
    });
    return NextResponse.json({ data: team }, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' } });
  } catch (error) {
    console.error('Public team error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
