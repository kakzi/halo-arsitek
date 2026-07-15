import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return NextResponse.json({ data: map }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600' } });
  } catch (error) {
    console.error('Public settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
