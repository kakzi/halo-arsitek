import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';

// ─── GET /api/admin/stats ────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    // ── Core counts ──────────────────────────────────────────────
    const [
      totalProjects,
      publishedProjects,
      totalNews,
      publishedNews,
      totalTestimonials,
      totalServices,
      totalTeamMembers,
      totalContacts,
      unreadContacts,
      totalProjectCategories,
      totalNewsCategories,
      totalPageViews,
      recentContacts,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { isPublished: true } }),
      prisma.news.count(),
      prisma.news.count({ where: { isPublished: true } }),
      prisma.testimonial.count(),
      prisma.service.count(),
      prisma.teamMember.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: 'UNREAD' } }),
      prisma.projectCategory.count(),
      prisma.newsCategory.count(),
      prisma.pageView.count(),
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          message: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // ── Today's page views ───────────────────────────────────────
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayPageViews = await prisma.pageView.count({
      where: { createdAt: { gte: startOfToday } },
    });

    // ── Page views for last 7 days (chart) ───────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentViews = await prisma.pageView.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    });

    const viewsByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      viewsByDay[key] = 0;
    }
    recentViews.forEach((v) => {
      const key = v.createdAt.toISOString().split('T')[0];
      if (viewsByDay[key] !== undefined) viewsByDay[key]++;
    });

    const viewsChart = Object.entries(viewsByDay).map(([date, count]) => {
      const d = new Date(date);
      return {
        label: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        count,
      };
    });

    // ── Top pages ────────────────────────────────────────────────
    const topPagesRaw = await prisma.pageView.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { path: true },
    });
    const topPagesMap: Record<string, number> = {};
    topPagesRaw.forEach((v) => {
      topPagesMap[v.path] = (topPagesMap[v.path] || 0) + 1;
    });
    const topPages = Object.entries(topPagesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));

    // ── Recent projects & news ───────────────────────────────────
    const recentProjects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        isPublished: true,
        createdAt: true,
        category: { select: { name: true } },
      },
    });

    const recentNews = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        isPublished: true,
        createdAt: true,
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({
      data: {
        projects: { total: totalProjects, published: publishedProjects },
        news: { total: totalNews, published: publishedNews },
        testimonials: { total: totalTestimonials },
        services: { total: totalServices },
        team: { total: totalTeamMembers },
        contacts: { total: totalContacts, unread: unreadContacts },
        categories: { projects: totalProjectCategories, news: totalNewsCategories },
        pageViews: { total: totalPageViews, today: todayPageViews },
        viewsChart,
        topPages,
        recentContacts,
        recentProjects,
        recentNews,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
