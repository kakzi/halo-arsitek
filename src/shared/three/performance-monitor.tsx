'use client';

import { useWebGLSupport } from '@/shared/hooks/use-webgl-support';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';

type RenderStrategy = 'full-3d' | 'simplified' | 'static-fallback';

export function useRenderStrategy(): RenderStrategy {
  const hasWebGL = useWebGLSupport();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useReducedMotion();

  if (!hasWebGL || prefersReducedMotion) return 'static-fallback';
  if (isMobile) return 'simplified';
  return 'full-3d';
}
