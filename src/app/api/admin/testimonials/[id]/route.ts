import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const updateTestimonialSchema = z.object({
  quote: z.string().min(1).optional(),
  name: z.string().min(1).max(255).optional(),
  role: z.string().min(1).max(255).optional(),
  project: z.string().min(1).max(255).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  return NextResponse.json({ data: testimonial });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateTestimonialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Validation error', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

    const testimonial = await prisma.testimonial.update({ where: { id }, data: validation.data });
    return NextResponse.json({ data: testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Testimonial berhasil dihapus' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
