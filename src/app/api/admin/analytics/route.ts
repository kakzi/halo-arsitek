import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { parseUserAgent } from '@/shared/lib/ua-parser';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // ── Counts ────────────────────────────────────────────────
    const [totalViews, todayViews] = await Promise.all([
      prisma.pageView.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.pageView.count({
        where: { createdAt: { gte: startOfToday } },
      }),
    ]);

    // ── Fetch all views for aggregation ────────────────────────
    const views = await prisma.pageView.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endOfToday,
        },
      },
      select: {
        createdAt: true,
        path: true,
        ip: true,
        userAgent: true,
        referrer: true,
      },
    });

    // ── Chart data (views per day) ────────────────────────────
    const chartDataMap: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      chartDataMap[dateString] = 0;
    }

    // ── Aggregation containers ────────────────────────────────
    const topPagesMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = {};
    const browserMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    const referrerMap: Record<string, number> = {};
    const uniqueIPs = new Set<string>();

    views.forEach((v) => {
      // Chart data
      const dateString = v.createdAt.toISOString().split('T')[0];
      if (chartDataMap[dateString] !== undefined) {
        chartDataMap[dateString]++;
      }

      // Top pages
      topPagesMap[v.path] = (topPagesMap[v.path] || 0) + 1;

      // Unique visitors by IP
      if (v.ip) uniqueIPs.add(v.ip);

      // Parse user agent
      const parsed = parseUserAgent(v.userAgent);
      deviceMap[parsed.device] = (deviceMap[parsed.device] || 0) + 1;
      browserMap[parsed.browser] = (browserMap[parsed.browser] || 0) + 1;
      osMap[parsed.os] = (osMap[parsed.os] || 0) + 1;

      // Referrer aggregation
      if (v.referrer && v.referrer.length > 0) {
        referrerMap[v.referrer] = (referrerMap[v.referrer] || 0) + 1;
      } else {
        referrerMap['Direct / None'] = (referrerMap['Direct / None'] || 0) + 1;
      }
    });

    // ── Format chart data ────────────────────────────────────
    const chartData = Object.entries(chartDataMap).map(([date, count]) => {
      const d = new Date(date);
      const formattedDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return { date: formattedDate, count, rawDate: date };
    });

    // ── Sort & limit aggregations ────────────────────────────
    const sortDesc = (map: Record<string, number>, limit: number = 10) =>
      Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));

    const topPages = Object.entries(topPagesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    return NextResponse.json({
      data: {
        totalViews,
        todayViews,
        uniqueVisitors: uniqueIPs.size,
        chartData,
        topPages,
        devices: sortDesc(deviceMap),
        browsers: sortDesc(browserMap),
        os: sortDesc(osMap),
        referrers: sortDesc(referrerMap),
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
