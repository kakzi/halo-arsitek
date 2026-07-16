import { createPageMetadata } from '@/shared/lib/metadata';
import { NewsContent } from '@/features/news/components/news-content';
import { prisma } from '@/shared/lib/prisma';
import { format } from 'date-fns';

export const metadata = createPageMetadata({
  title: 'News',
  description: 'Latest updates, publications, and press coverage from HaloArsitek.',
  path: '/news',
});

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  const formattedNews = news.map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content,
    date: format(new Date(item.createdAt), 'dd MMM yyyy'),
    image: item.coverImage,
    category: item.category.name,
  }));

  return <NewsContent newsItems={formattedNews} />;
}
