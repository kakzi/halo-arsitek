import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { path, referrer } = await request.json();

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Capture basic request data
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Ignore admin routes and API routes from analytics to keep public stats clean
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // Clean referrer — extract hostname only, ignore self-referrals
    let cleanReferrer: string | null = null;
    if (referrer && typeof referrer === 'string' && referrer.length > 0) {
      try {
        const refUrl = new URL(referrer);
        cleanReferrer = refUrl.hostname;
      } catch {
        cleanReferrer = referrer.substring(0, 500);
      }
    }

    await prisma.pageView.create({
      data: {
        path,
        ip: ip.substring(0, 45), // Limit length
        userAgent,
        referrer: cleanReferrer,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    // Return 200 even on error so client doesn't retry/complain
    return NextResponse.json({ success: false });
  }
}
