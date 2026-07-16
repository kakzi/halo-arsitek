import { notFound } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';
import { NewsDetailClient } from './news-detail-client';

export async function generateStaticParams() {
  const news = await prisma.news.findMany({ select: { slug: true } });
  return news.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const newsItem = await prisma.news.findUnique({ where: { slug: resolvedParams.slug } });
  if (!newsItem) return { title: 'Not Found' };
  
  return {
    title: `${newsItem.title} — HaloArsitek`,
    description: newsItem.content.length > 150 ? newsItem.content.substring(0, 150) + '...' : newsItem.content,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const newsItem = await prisma.news.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  });

  if (!newsItem) {
    notFound();
  }

  return <NewsDetailClient newsItem={newsItem} />;
}
