import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const createServiceSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  icon: z.string().min(1).max(50),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const services = await prisma.service.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ data: services });
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = createServiceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation error', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const service = await prisma.service.create({ data: validation.data });
    return NextResponse.json({ data: service }, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
