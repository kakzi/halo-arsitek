'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { cn } from '@/shared/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = 'h2',
}: TextRevealProps) {
  const ref = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    const element = ref.current;
    
    // Simple word reveal instead of chars for better performance & readability
    const words = element.querySelectorAll('.word-wrapper');

    gsap.fromTo(
      words,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          once: true,
        },
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === element) t.kill();
      });
    };
  }, [delay, prefersReducedMotion]);

  // Split text into words for animation
  const words = text.split(' ').map((word, i) => (
    <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-1">
      <span className="word-wrapper inline-block" style={{ opacity: prefersReducedMotion ? 1 : 0 }}>
        {word}
      </span>
    </span>
  ));

  return (
    <Tag ref={ref} className={cn(className)}>
      {words}
    </Tag>
  );
}
