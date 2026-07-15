import type { Metadata } from 'next';
import { playfair, inter, outfit } from '@/shared/lib/fonts';
import { siteConfig } from '@/shared/config/site.config';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Tracker } from '@/features/analytics/components/tracker';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Jasa Arsitek & Desain Interior Premium Indonesia`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { prisma } from '@/shared/lib/prisma';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let gaId = '';
  try {
    const gaSetting = await prisma.siteSetting.findUnique({
      where: { key: 'google_analytics_id' },
    });
    if (gaSetting && gaSetting.value) {
      gaId = gaSetting.value;
    }
  } catch (error) {
    console.error('Failed to fetch GA ID:', error);
  }

  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        {children}
      </body>
      <Tracker />
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
