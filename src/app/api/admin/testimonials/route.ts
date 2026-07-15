import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const createTestimonialSchema = z.object({
  quote: z.string().min(1, 'Quote wajib diisi'),
  name: z.string().min(1, 'Nama wajib diisi').max(255),
  role: z.string().min(1, 'Role wajib diisi').max(255),
  project: z.string().min(1, 'Nama proyek wajib diisi').max(255),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

// ─── GET /api/admin/testimonials ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.testimonial.count(),
    ]);

    return NextResponse.json({
      data: testimonials,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ─── POST /api/admin/testimonials ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = createTestimonialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: validation.data,
    });

    return NextResponse.json({ data: testimonial }, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
