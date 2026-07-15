import { createPageMetadata } from '@/shared/lib/metadata';
import { FullscreenSlider } from '@/features/hero/components/fullscreen-slider';

// Generate SEO Metadata for the home page
export const metadata = createPageMetadata({
  title: 'Jasa Arsitek & Desain Interior Premium Indonesia',
  description:
    'Studio arsitektur profesional dengan pengalaman 15+ tahun. Spesialis desain rumah modern, interior premium, dan landscape. Konsultasi gratis!',
  path: '/',
});

export default function HomePage() {
  return (
    <main className="h-screen w-full overflow-hidden bg-white">
      <FullscreenSlider />
    </main>
  );
}
