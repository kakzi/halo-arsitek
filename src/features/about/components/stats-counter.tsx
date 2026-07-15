'use client';

import { useEffect, useRef, useState } from 'react';
import { useIntersection } from '@/shared/hooks/use-intersection';

interface StatsCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

export function StatsCounter({ end, suffix = '', duration = 2 }: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const { ref, hasIntersected } = useIntersection<HTMLSpanElement>({
    threshold: 0.5,
  });

  useEffect(() => {
    if (!hasIntersected) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [hasIntersected, end, duration]);

  return (
    <span ref={ref} className="font-playfair tabular-nums">
      {count}
      {suffix}
    </span>
  );
}
