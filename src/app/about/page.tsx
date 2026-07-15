import { createPageMetadata } from '@/shared/lib/metadata';
import { AboutContent } from '@/features/about/components/about-content';

export const metadata = createPageMetadata({
  title: 'About',
  description: 'Learn about HaloArsitek — a premium architecture and interior design studio in Indonesia.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutContent />;
}
