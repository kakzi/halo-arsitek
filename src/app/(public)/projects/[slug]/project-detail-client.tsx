'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
// import { Project } from '@/shared/lib/constants';

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

        {/* ── CONTAINED HERO IMAGE ── */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1] bg-[#F7F7F7] mb-20 md:mb-28 overflow-hidden rounded-sm"
        >
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
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

        {/* ── GALLERY GRID ── */}
        {imagesArray.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-32">
            {imagesArray.map((img, index) => (
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
                <img
                  src={img}
                  alt={`${project.title} - image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
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
            className="text-3xl md:text-5xl font-medium text-[#1A1A1A] hover:text-[#A67C52] transition-colors mb-12"
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
