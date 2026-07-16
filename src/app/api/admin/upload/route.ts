import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAuthError } from '@/shared/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Allowed image MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ─── POST /api/admin/upload ──────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth.error;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipe file tidak didukung. Gunakan: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${uuidv4()}.${ext}`;
    
    // Create upload directory structure based on date
    const now = new Date();
    const datePath = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', datePath);
    
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL
    const url = `/uploads/${datePath}/${filename}`;

    return NextResponse.json({
      data: {
        url,
        filename,
        size: file.size,
        type: file.type,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 });
  }
}
