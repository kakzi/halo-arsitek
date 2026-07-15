import { createPageMetadata } from '@/shared/lib/metadata';
import { NewsContent } from '@/features/news/components/news-content';

export const metadata = createPageMetadata({
  title: 'News',
  description: 'Latest updates, publications, and press coverage from HaloArsitek.',
  path: '/news',
});

export default function NewsPage() {
  return <NewsContent />;
}
