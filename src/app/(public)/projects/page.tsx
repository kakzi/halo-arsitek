import { createPageMetadata } from '@/shared/lib/metadata';
import { ProjectsGrid } from '@/features/portfolio/components/projects-grid';
import { prisma } from '@/shared/lib/prisma';

export const metadata = createPageMetadata({
  title: 'Projects',
  description: 'Explore our portfolio of residential, commercial, and interior design projects.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { sortOrder: 'asc' }
  });
  const categories = await prisma.projectCategory.findMany({ orderBy: { name: 'asc' } });
  const categoryNames = ['All', ...categories.map(c => c.name)];

  return <ProjectsGrid projects={projects} categories={categoryNames} />;
}
