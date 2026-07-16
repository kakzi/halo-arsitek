'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { projects } from '@/shared/lib/constants';
import { navItems } from '@/shared/config/navigation.config';
import { Magnetic } from '@/shared/animations/magnetic';

const AUTOSLIDE_INTERVAL = 6000; // 6 seconds

const slideVariants: Variants = {
  enter: (dir: number) => ({ 
    opacity: 0,
    scale: 1.05,
    filter: 'blur(10px)'
  }),
  center: { 
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2, 
      ease: [0.19, 1, 0.22, 1] as any
    }
  },
  exit: (dir: number) => ({ 
    opacity: 0, 
    zIndex: 0,
    transition: {
      duration: 0.8, 
      ease: [0.19, 1, 0.22, 1] as any
    }
  }),
};

export function FullscreenSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [isClient, setIsClient] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex === currentIndex) return;
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const handleNext = useCallback(() => goToSlide((currentIndex + 1) % projects.length), [currentIndex, goToSlide]);
  const handlePrev = useCallback(() => goToSlide((currentIndex - 1 + projects.length) % projects.length), [currentIndex, goToSlide]);

  // Autoslider functionality
  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      handleNext();
    }, AUTOSLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [handleNext, isHovering]);

  if (!isClient) return <div className="w-full h-screen bg-[#0A0A0A]" />;

  const p = projects[currentIndex];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  return (
    <div 
      className="fixed inset-0 bg-white flex flex-col items-center justify-center select-none overflow-hidden" 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      
      {/* ── Boxed Image Container ── */}
      <div className="relative w-[calc(100vw-2rem)] md:w-[calc(100vw-4rem)] h-[calc(100vh-11rem)] md:h-[calc(100vh-10rem)] overflow-hidden rounded-[2rem] md:rounded-3xl shadow-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full origin-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) handleNext();
              else if (swipe > swipeConfidenceThreshold) handlePrev();
            }}
          >
            {/* Ken Burns Effect Wrapper */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: AUTOSLIDE_INTERVAL / 1000 + 2, ease: "linear" }}
              className="w-full h-full relative"
            >
              <Image
                src={p.coverImage}
                alt={p.title}
                fill
                className="object-cover pointer-events-none"
                priority
                sizes="(max-width: 768px) 100vw, 95vw"
                quality={90}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {/* Premium Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 pointer-events-none z-10" />

        {/* ── Content Inside the Box ── */}
        
        {/* Caption Overlay */}
        <div className="absolute bottom-24 md:bottom-16 left-6 md:left-12 z-20 pointer-events-none">
          <div className="overflow-hidden mb-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`subtitle-${p.id}`}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="w-10 h-[1px] bg-white" />
                <span className="text-white text-xs md:text-sm tracking-[0.2em] uppercase font-medium drop-shadow-md">
                  {p.location} &mdash; {p.year}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="overflow-hidden py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${p.id}`}
                initial={{ y: '100%', opacity: 0, rotateZ: 2 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                exit={{ y: '-50%', opacity: 0 }}
                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              >
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-[#C19A6B] hover:text-[#A87B51] transition-colors font-medium text-4xl md:text-6xl lg:text-7xl pointer-events-auto drop-shadow-xl inline-block"
                  style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
                >
                  {p.title}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Fixed Counter with Progress (Inside Box Right) ── */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 z-30 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="text-white text-sm tabular-nums font-medium drop-shadow-md tracking-widest"
            >
              {String(currentIndex + 1).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
          
          {/* Progress indicator */}
          <div className="w-[2px] h-20 bg-white/20 relative overflow-hidden rounded-full">
            <motion.div 
              key={currentIndex}
              className="w-full bg-white absolute top-0 left-0"
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: AUTOSLIDE_INTERVAL / 1000, ease: "linear" }}
            />
          </div>

          <span className="text-white/80 text-xs tabular-nums drop-shadow-md tracking-widest">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {/* ── Arrows (Inside Box Bottom-right) ── */}
        <div className="absolute bottom-8 md:bottom-12 right-6 md:right-10 z-30 flex items-center gap-2 md:gap-4">
          <Magnetic>
            <button 
              onClick={handlePrev}
              className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md bg-black/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="scale-75 md:scale-100">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </Magnetic>
          <Magnetic>
            <button 
              onClick={handleNext}
              className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md bg-black/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="scale-75 md:scale-100">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </Magnetic>
        </div>
      </div>


      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

