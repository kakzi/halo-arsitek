import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const updateServiceSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().min(1).max(50).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  return NextResponse.json({ data: service });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateServiceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation error', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

    const service = await prisma.service.update({ where: { id }, data: validation.data });
    return NextResponse.json({ data: service });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Service berhasil dihapus' });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
