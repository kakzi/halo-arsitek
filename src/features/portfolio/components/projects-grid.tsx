'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { projects } from '@/shared/lib/constants';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export function ProjectsGrid() {
  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pt-16">
      <div className="container-narrow px-6 md:px-8 py-12">

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="text-2xl md:text-[2rem] mb-12"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Projects
        </motion.h1>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] mb-3 rounded-sm">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <p className="text-[#3A3A3A] group-hover:text-[#1A1A1A] transition-colors mb-[2px]"
                  style={{ fontSize: '0.78rem', letterSpacing: '-0.01em' }}>
                  {project.title}
                </p>
                <p className="text-[#C8C2C1]" style={{ fontSize: '0.65rem' }}>
                  {project.location}, {project.year}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
