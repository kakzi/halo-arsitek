import { notFound } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';
import { ProjectDetailClient } from './project-detail-client';

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ select: { slug: true } });
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({ where: { slug: resolvedParams.slug } });
  if (!project) return { title: 'Not Found' };
  
  return {
    title: `${project.title} — HaloArsitek`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [
        {
          url: project.coverImage,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.coverImage],
    }
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  });

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
