'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { cn } from '@/shared/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  triggerOffset?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className,
  triggerOffset = 'top 85%',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current || direction === 'none') return;

    const element = ref.current;
    
    const offsets = {
      up: { y: 60, x: 0 },
      down: { y: -60, x: 0 },
      left: { x: 60, y: 0 },
      right: { x: -60, y: 0 },
    };

    gsap.fromTo(
      element,
      { 
        opacity: 0, 
        ...offsets[direction] 
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: triggerOffset,
          once,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [direction, delay, duration, prefersReducedMotion, triggerOffset, once]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{ opacity: prefersReducedMotion || direction === 'none' ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
