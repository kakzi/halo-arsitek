import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { z } from 'zod';

const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(255),
  role: z.string().min(1, 'Role wajib diisi').max(255),
  image: z.string().min(1, 'Foto wajib diisi').max(500),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const members = await prisma.teamMember.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ data: members });
  } catch (error) {
    console.error('Get team error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const body = await request.json();
    const validation = createTeamMemberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation error', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const member = await prisma.teamMember.create({ data: validation.data });
    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
