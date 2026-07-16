'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/shared/lib/constants';

export function ProjectDetailClient({ project }: { project: Project }) {
  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pb-32">
      
      {/* ── HERO SECTION ── */}
      <div className="relative w-full h-[70vh] md:h-[85vh] bg-[#F7F7F7]">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        
        <div className="absolute bottom-10 left-6 md:left-12 right-6 md:right-12 z-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="w-10 h-[1px] bg-white/70" />
            <span className="text-white/90 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
              {project.category}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-[5rem] text-white font-medium drop-shadow-xl"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {project.title}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
        
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
            <p className="text-xl md:text-3xl text-[#1A1A1A] leading-[1.6]" style={{ fontFamily: 'var(--font-playfair)' }}>
              {project.description}
            </p>
          </motion.div>

        </div>

        {/* ── GALLERY GRID ── */}
        {project.images && project.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-32">
            {project.images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: (index % 2) * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`relative bg-[#F7F7F7] rounded-sm overflow-hidden ${
                  index % 3 === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
                }`}
              >
                <Image
                  src={img}
                  alt={`${project.title} - image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-[1.03] transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  sizes={index % 3 === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                />
              </motion.div>
            ))}
          </div>
        )}

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
