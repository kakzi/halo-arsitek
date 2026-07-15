import type { Metadata } from 'next';
import { playfair, inter, outfit } from '@/shared/lib/fonts';
import { siteConfig } from '@/shared/config/site.config';
import { Navbar, BottomNav } from '@/features/navigation';
import { PageTransition } from '@/shared/animations/page-transition';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} ${outfit.variable}`}
    >
      <body className="h-screen overflow-hidden">
        <Navbar />
        <BottomNav />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
