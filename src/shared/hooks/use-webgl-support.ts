import { useState, useEffect } from 'react';

export function useWebGLSupport() {
  const [hasSupport, setHasSupport] = useState<boolean>(true); // Optimistic default

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasSupport(!!gl);
    } catch (e) {
      setHasSupport(false);
    }
  }, []);

  return hasSupport;
}
