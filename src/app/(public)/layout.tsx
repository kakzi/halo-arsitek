import { Navbar, BottomNav } from '@/features/navigation';
import { PageTransition } from '@/shared/animations/page-transition';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <BottomNav />
      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}
