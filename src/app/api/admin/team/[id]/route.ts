import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const updateTeamMemberSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.string().min(1).max(255).optional(),
  image: z.string().min(1).max(500).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  return NextResponse.json({ data: member });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateTeamMemberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation error', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

    const member = await prisma.teamMember.update({ where: { id }, data: validation.data });
    return NextResponse.json({ data: member });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Anggota tim berhasil dihapus' });
  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
