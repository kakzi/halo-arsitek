import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireRole, isAuthError } from '@/shared/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireRole(request, ['SUPER_ADMIN', 'ADMIN']);
    if (isAuthError(auth)) return auth.error;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50', 10)));
    const search = searchParams.get('search')?.trim() || '';

    const whereClause: any = search
      ? {
          OR: [
            { action: { contains: search } },
            { details: { contains: search } },
            { adminName: { contains: search } },
          ],
        }
      : {};

    const [total, logs] = await Promise.all([
      prisma.activityLog.count({ where: whereClause }),
      prisma.activityLog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}
