import { notFound } from 'next/navigation';
import { projects } from '@/shared/lib/constants';
import { ProjectDetailClient } from './project-detail-client';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projects.find((p) => p.slug === resolvedParams.slug);
  if (!project) return { title: 'Not Found' };
  
  return {
    title: `${project.title} — HaloArsitek`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projects.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
