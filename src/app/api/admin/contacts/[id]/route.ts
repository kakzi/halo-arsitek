import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';

type RouteParams = { params: Promise<{ id: string }> };

// ─── GET /api/admin/contacts/[id] ────────────────────────────────────────────

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  const { id } = await params;
  const contact = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!contact) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  return NextResponse.json({ data: contact });
}

// ─── PATCH /api/admin/contacts/[id] (update status) ─────────────────────────

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (body.status) data.status = body.status;
    if (body.status === 'READ' && !existing.readAt) data.readAt = new Date();

    const contact = await prisma.contactSubmission.update({ where: { id }, data });
    return NextResponse.json({ data: contact });
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── DELETE /api/admin/contacts/[id] ─────────────────────────────────────────

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

    await prisma.contactSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Pesan berhasil dihapus' });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
