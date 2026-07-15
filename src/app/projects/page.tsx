import { createPageMetadata } from '@/shared/lib/metadata';
import { ProjectsGrid } from '@/features/portfolio/components/projects-grid';

export const metadata = createPageMetadata({
  title: 'Projects',
  description: 'Explore our portfolio of residential, commercial, and interior design projects.',
  path: '/projects',
});

export default function ProjectsPage() {
  return <ProjectsGrid />;
}
