import { createPageMetadata } from '@/shared/lib/metadata';
import { FullscreenSlider } from '@/features/hero/components/fullscreen-slider';
import { prisma } from '@/shared/lib/prisma';

// Generate SEO Metadata for the home page
export const metadata = createPageMetadata({
  title: 'Jasa Arsitek & Desain Interior Premium Indonesia',
  description:
    'Studio arsitektur profesional dengan pengalaman 15+ tahun. Spesialis desain rumah modern, interior premium, dan landscape. Konsultasi gratis!',
  path: '/',
});

export const dynamic = 'force-dynamic';

interface SlideProject {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  location: string;
  year: number;
}

export default async function HomePage() {
  let headlinerProjects: SlideProject[] = [];
  try {
    headlinerProjects = await prisma.project.findMany({
      where: { isPublished: true, isHeadliner: true },
      orderBy: [{ sortOrder: 'asc' }, { year: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        location: true,
        year: true,
      },
    });

    if (headlinerProjects.length === 0) {
      headlinerProjects = await prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { year: 'desc' }],
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          location: true,
          year: true,
        },
      });
    }
  } catch (error) {
    console.error('Failed to load headliner projects in SSR:', error);
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <FullscreenSlider initialProjects={headlinerProjects} />
    </main>
  );
}
