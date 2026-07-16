import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string().min(1),
    value: z.string(),
    type: z.enum(['STRING', 'NUMBER', 'JSON', 'BOOLEAN']).default('STRING'),
  })),
});

// ─── GET /api/admin/settings ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });

    // Transform to key-value map for easy consumption
    const settingsMap: Record<string, { value: string; type: string }> = {};
    for (const s of settings) {
      settingsMap[s.key] = { value: s.value, type: s.type };
    }

    return NextResponse.json({ data: settings, map: settingsMap });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── PUT /api/admin/settings (bulk update) ───────────────────────────────────

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = updateSettingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Upsert each setting
    const results = await Promise.all(
      validation.data.settings.map((setting) =>
        prisma.siteSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value, type: setting.type },
          create: { key: setting.key, value: setting.value, type: setting.type },
        })
      )
    );

    return NextResponse.json({ data: results, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
