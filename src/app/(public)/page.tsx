import { createPageMetadata } from '@/shared/lib/metadata';
import { FullscreenSlider } from '@/features/hero/components/fullscreen-slider';

// Generate SEO Metadata for the home page
export const metadata = createPageMetadata({
  title: 'Jasa Arsitek & Desain Interior Premium Indonesia',
  description:
    'Studio arsitektur profesional dengan pengalaman 15+ tahun. Spesialis desain rumah modern, interior premium, dan landscape. Konsultasi gratis!',
  path: '/',
});

import { prisma } from '@/shared/lib/prisma';

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <FullscreenSlider projects={projects} />
    </main>
  );
}
