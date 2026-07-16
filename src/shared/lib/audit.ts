import { NextRequest } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import type { AdminJWTPayload } from '@/shared/lib/auth/jwt';

interface LogActivityParams {
  action: string;
  details?: string;
  admin?: AdminJWTPayload;
  request?: NextRequest;
  adminName?: string;
  adminRole?: string;
}

/**
 * Log an administrative action to the database activity_logs table.
 * Does not throw errors to prevent blocking main business operations if logging fails.
 */
export async function logActivity({
  action,
  details,
  admin,
  request,
  adminName,
  adminRole,
}: LogActivityParams): Promise<void> {
  try {
    const name = admin?.name || adminName || 'System';
    const role = admin?.role || adminRole || 'ADMIN';
    let ipAddress: string | null = null;

    if (request) {
      ipAddress =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        null;
    }

    await prisma.activityLog.create({
      data: {
        action,
        details: details || null,
        adminName: name,
        adminRole: role,
        ipAddress,
      },
    });
  } catch (err) {
    console.error('Failed to write activity log:', err);
  }
}
