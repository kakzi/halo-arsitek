'use client';

import { AuthProvider, AdminUIProvider, useAdminUI, AdminSidebar } from '@/features/admin';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function AdminLayoutContent({ children, isLoginPage, sidebarWidth }: { children: React.ReactNode; isLoginPage: boolean; sidebarWidth: number }) {
  const { isMobile, isMobileSidebarOpen, setIsMobileSidebarOpen } = useAdminUI();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--admin-bg-page)',
        color: 'var(--admin-text-primary)',
        display: 'flex',
        overflow: 'auto',
      }}
    >
      {!isLoginPage && <AdminSidebar />}
      {!isLoginPage && isMobile && isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 45,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}
      <main
        style={{
          flex: 1,
          marginLeft: isLoginPage || isMobile ? 0 : `${sidebarWidth}px`,
          minHeight: '100vh',
          transition: 'margin-left 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          overflow: 'auto',
          width: isMobile ? '100%' : 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarWidth, setSidebarWidth] = useState(260);

  // Listen for sidebar collapse
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const sidebar = document.querySelector('.admin-sidebar') as HTMLElement;
      if (sidebar) {
        const width = parseInt(sidebar.style.width);
        setSidebarWidth(width || 260);
      }
    });

    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['style'] });
    }

    return () => observer.disconnect();
  }, [isLoginPage]);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} storageKey="admin-theme">
      <AuthProvider>
        <AdminUIProvider>
          <AdminLayoutContent isLoginPage={isLoginPage} sidebarWidth={sidebarWidth}>
            {children}
          </AdminLayoutContent>
        </AdminUIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
