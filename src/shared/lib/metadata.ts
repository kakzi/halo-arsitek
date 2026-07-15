import type { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site.config';

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, path = '/', ogImage, noIndex } = options;
  const url = `${siteConfig.url}${path}`;

  return {
    title: `${title} — ${siteConfig.name}`,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || siteConfig.ogImage],
    },
  };
}
