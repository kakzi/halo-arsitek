'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUIContextType {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  toggleMobileSidebar: () => void;
  isMobile: boolean;
}

const AdminUIContext = createContext<AdminUIContextType | undefined>(undefined);

export function AdminUIProvider({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <AdminUIContext.Provider value={{ isMobileSidebarOpen, setIsMobileSidebarOpen, toggleMobileSidebar, isMobile }}>
      {children}
    </AdminUIContext.Provider>
  );
}

export function useAdminUI() {
  const context = useContext(AdminUIContext);
  if (context === undefined) {
    throw new Error('useAdminUI must be used within an AdminUIProvider');
  }
  return context;
}
