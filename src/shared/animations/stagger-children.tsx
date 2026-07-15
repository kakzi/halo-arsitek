'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { cn } from '@/shared/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  className,
}: StaggerChildrenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const childrenElements = containerRef.current.children;
    
    if (childrenElements.length === 0) return;

    const offsets = {
      up: { y: 40, x: 0 },
      down: { y: -40, x: 0 },
      left: { x: 40, y: 0 },
      right: { x: -40, y: 0 },
    };

    gsap.set(childrenElements, { opacity: 0, ...offsets[direction] });

    gsap.to(childrenElements, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      stagger: staggerDelay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      },
    });
    
    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, [direction, staggerDelay, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
