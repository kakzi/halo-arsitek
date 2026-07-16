'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

export function ProjectDetailClient({ project }: { project: any }) {
  let imagesArray: string[] = [];
  if (Array.isArray(project.images)) {
    imagesArray = project.images;
  } else if (typeof project.images === 'string') {
    try {
      imagesArray = JSON.parse(project.images);
      if (!Array.isArray(imagesArray)) imagesArray = [];
    } catch (e) {}
  }

  const allImages = [project.coverImage, ...imagesArray].filter(Boolean);
  
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have length of allImages, so we wrap the index
  const activeIndex = Math.abs(page % allImages.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDotClick = (newIndex: number) => {
    const newDirection = newIndex > activeIndex ? 1 : -1;
    // Calculate the difference and add to current page to keep it continuous
    const diff = newIndex - activeIndex;
    setPage([page + diff, newDirection]);
  };

  // Auto-slide effect
  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4000); // 4 seconds per slide
    
    return () => clearInterval(interval);
  }, [allImages.length, page]);

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pb-32 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        
        {/* ── TITLE SECTION ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-10"
        >
          <span className="text-[#8A8584] text-[0.65rem] md:text-xs tracking-[0.25em] uppercase font-medium mb-6">
            {project.category?.name || 'Project'}
          </span>
          <h1 
            className="text-2xl md:text-3xl lg:text-4xl text-[#1A1A1A]" 
            style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
          >
            {project.title}
          </h1>
        </motion.div>

        {/* ── IMAGE GALLERY PREVIEW ── */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 md:mb-28 w-full"
        >
          {/* Main Large Image */}
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1] bg-[#F7F7F7] overflow-hidden rounded-sm mb-4 cursor-grab active:cursor-grabbing">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={page}
                src={allImages[activeIndex]}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                alt={`${project.title} - main preview`}
                className="absolute w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Mobile Dots Indicator */}
          {allImages.length > 0 && (
            <div className="flex md:hidden items-center justify-center gap-2 mt-6">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? 'w-6 bg-[#A67C52]' : 'w-1.5 bg-[#E5E5E5] hover:bg-[#D4D4D4]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Desktop Thumbnails Row */}
          {allImages.length > 0 && (
            <div className="hidden md:flex overflow-x-auto gap-4 py-2 px-1 hide-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`relative shrink-0 w-20 h-14 md:w-32 md:h-24 bg-[#F7F7F7] rounded-sm overflow-hidden transition-all duration-300 ${
                    activeIndex === idx ? 'ring-2 ring-[#A67C52] ring-offset-2' : 'opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* ── METADATA & DESCRIPTION ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20 md:mb-32">
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/3 grid grid-cols-2 gap-y-10 gap-x-6"
          >
            <div>
              <p className="text-xs text-[#8A8584] uppercase tracking-widest mb-2">Location</p>
              <p className="text-sm text-[#1A1A1A] font-medium">{project.location}</p>
            </div>
            <div>
              <p className="text-xs text-[#8A8584] uppercase tracking-widest mb-2">Year</p>
              <p className="text-sm text-[#1A1A1A] font-medium">{project.year}</p>
            </div>
            <div>
              <p className="text-xs text-[#8A8584] uppercase tracking-widest mb-2">Area</p>
              <p className="text-sm text-[#1A1A1A] font-medium">{project.area}</p>
            </div>
            <div>
              <p className="text-xs text-[#8A8584] uppercase tracking-widest mb-2">Service</p>
              <p className="text-sm text-[#1A1A1A] font-medium capitalize">Architectural Design</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-2/3"
          >
            <p className="text-base md:text-lg lg:text-xl text-[#3A3A3A] leading-[1.7]" style={{ fontFamily: 'var(--font-playfair)' }}>
              {project.description}
            </p>
          </motion.div>

        </div>

        {/* ── CALL TO ACTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center border-t border-[#E5E5E5] pt-20"
        >
          <p className="text-[#8A8584] uppercase tracking-widest text-xs mb-8">Ready to start your project?</p>
          <Link 
            href="/contact"
            className="text-3xl md:text-5xl font-medium text-[#1A1A1A] hover:text-[#1E293B] transition-colors mb-12"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Let's Talk
          </Link>
          <Link 
            href="/projects"
            className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-[#1A1A1A] hover:opacity-60 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
            Back to Projects
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
