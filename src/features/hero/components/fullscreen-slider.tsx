'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { projects } from '@/shared/lib/constants';
import { navItems } from '@/shared/config/navigation.config';
import { cn } from '@/shared/lib/utils';
import { Magnetic } from '@/shared/animations/magnetic';

// Spring configurations
const imageSpring: Transition = { type: 'spring', stiffness: 200, damping: 35, mass: 1 };
const captionSpring: Transition = { type: 'spring', stiffness: 150, damping: 20 };
const layoutSpring: Transition = { type: 'spring', stiffness: 100, damping: 25, mass: 1 };

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', scale: 0.9, opacity: 0 }),
  center: { x: '0%', scale: 1, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', scale: 0.9, opacity: 0, zIndex: 0 }),
};

export function FullscreenSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex === currentIndex) return;
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const handleNext = useCallback(() => goToSlide((currentIndex + 1) % projects.length), [currentIndex, goToSlide]);
  const handlePrev = useCallback(() => goToSlide((currentIndex - 1 + projects.length) % projects.length), [currentIndex, goToSlide]);

  if (!isClient) return <div className="w-full h-screen bg-white" />;

  const p = projects[currentIndex];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center select-none overflow-hidden">
      
      {/* ── Central Image Block ── */}
      <motion.div 
        layout
        transition={layoutSpring}
        className="relative" 
        style={{ height: 'min(calc(100vh - 180px), 600px)', aspectRatio: '2/3' }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-md bg-[#F7F7F7] isolate cursor-grab active:cursor-grabbing">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
              transition={imageSpring}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) handleNext();
                else if (swipe > swipeConfidenceThreshold) handlePrev();
              }}
            >
              <Image
                src={p.coverImage}
                alt={p.title}
                fill
                className="object-cover pointer-events-none"
                priority
                sizes="(max-width: 768px) 80vw, 400px"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption */}
        <div className="mt-5">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={captionSpring}
                className="flex justify-between items-baseline"
              >
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-[#3A3A3A] hover:text-[#1A1A1A] transition-colors font-medium"
                  style={{ fontSize: '0.85rem', letterSpacing: '-0.01em' }}
                >
                  {p.title}
                </Link>
                <span className="text-[#A5A2A1]" style={{ fontSize: '0.75rem' }}>
                  {p.location}, {p.year}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Fixed Counter (Right) ── */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 md:right-10 z-30 flex flex-col items-center gap-2 opacity-60">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-[#3A3A3A] text-sm tabular-nums"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {String(currentIndex + 1).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
        <span className="w-[1px] h-6 bg-[#D4D4D4]" />
        <span className="text-[#C8C2C1] text-xs tabular-nums" style={{ fontFamily: 'var(--font-outfit)' }}>
          {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Fixed Bottom-left Nav ── */}
      <nav className="fixed bottom-7 left-6 md:left-8 z-30 flex gap-6 md:gap-8 overflow-hidden">
        {navItems.map((item, i) => (
          <Magnetic key={item.label}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ ...captionSpring, delay: 0.5 + i * 0.1 }}
            >
              <Link 
                href={item.href}
                className="text-[#A5A2A1] hover:text-[#1A1A1A] transition-colors duration-300 relative group"
                style={{ fontSize: '0.78rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#1A1A1A] transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          </Magnetic>
        ))}
      </nav>

      {/* ── Fixed Bottom-right Arrows ── */}
      <div className="fixed bottom-7 right-6 md:right-8 z-30 flex items-center gap-3">
        <Magnetic>
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#A5A2A1] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            aria-label="Previous slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </Magnetic>
        <Magnetic>
          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center text-[#A5A2A1] hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            aria-label="Next slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </Magnetic>
      </div>

    </div>
  );
}
