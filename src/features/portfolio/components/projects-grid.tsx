'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
// import { projects } from '@/shared/lib/constants';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

interface ProjectsGridProps {
  projects: any[];
  categories: string[];
}

export function ProjectsGrid({ projects, categories }: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category.name.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pb-32">
      {/* Sticky solid white block to protect the Navbar logo from scrolling images */}
      <div className="sticky top-0 z-40 w-full h-[76px] md:h-[84px] bg-white" />

      <div className="container-narrow px-6 md:px-8 pb-12 pt-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="text-2xl md:text-[2rem] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Projects
        </motion.h1>

        <div className="sticky top-[76px] md:top-[84px] z-50 pt-4 pb-2 -mx-6 px-6 md:-mx-8 md:px-8 mb-6 bg-white">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative flex gap-6 md:gap-8 pb-3 overflow-x-auto hide-scrollbar"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap transition-colors duration-300 relative pb-2 ${activeCategory === cat ? "text-[#1A1A1A]" : "text-[#BFB8B7] hover:text-[#5D5C5C]"
                  }`}
                style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.span
                    layoutId="activeCategoryIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#1A1A1A] block"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10"
          >
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] mb-3 rounded-sm">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />

                    {/* Watermark */}
                    <div className="absolute bottom-3 right-3 z-10 opacity-30 pointer-events-none drop-shadow-sm">
                      <img
                        src="/logo/logo-halo-arsitek-white.png"
                        alt="Watermark"
                        className="w-5 h-5 md:w-6 md:h-6 object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-[#3A3A3A] group-hover:text-[#1A1A1A] transition-colors mb-[2px]"
                    style={{ fontSize: '0.78rem', letterSpacing: '-0.01em' }}>
                    {project.title}
                  </p>
                  <p className="text-[#C8C2C1]" style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
                    {project.category.name} — {project.year}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
