'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public paths
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || '',
      })
    }).catch(() => {}); // silent fail
  }, [pathname]);

  return null;
}
