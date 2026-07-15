'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { teamMembers } from '@/shared/lib/constants';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export function AboutContent() {
  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pt-16">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container-narrow px-6 md:px-8 py-12"
      >

        <motion.h1 variants={itemVariants} className="text-2xl md:text-[2rem] mb-12"
          style={{ fontFamily: 'var(--font-playfair)' }}>
          About
        </motion.h1>

        {/* Description */}
        <motion.div variants={itemVariants} className="max-w-[560px] mb-16">
          <p className="text-[#5D5C5C] leading-[1.85] mb-5" style={{ fontSize: '0.84rem' }}>
            HaloArsitek adalah studio arsitektur dan desain interior yang berbasis di Jakarta, Indonesia.
            Didirikan dengan visi menciptakan ruang-ruang yang tidak hanya indah secara estetika,
            tetapi juga fungsional dan berkelanjutan.
          </p>
          <p className="text-[#5D5C5C] leading-[1.85] mb-5" style={{ fontSize: '0.84rem' }}>
            Kami percaya bahwa arsitektur yang baik adalah dialog antara konteks, material, dan manusia.
            Setiap proyek kami pendekati dengan sensitivitas terhadap lingkungan setempat, budaya, dan
            kebutuhan unik dari setiap klien.
          </p>
          <p className="text-[#5D5C5C] leading-[1.85]" style={{ fontSize: '0.84rem' }}>
            Dengan pengalaman lebih dari satu dekade, studio kami telah mengerjakan berbagai tipologi
            — dari hunian pribadi, ruang komersial, hingga proyek hospitality.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="w-8 h-px bg-[#D4D4D4] mb-10" />

        {/* Team */}
        <motion.p variants={itemVariants} className="label mb-8">Team</motion.p>

        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {teamMembers.map((member) => (
            <div key={member.id}>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] mb-3 rounded-sm">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale hover:grayscale-0 hover:scale-[1.02] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <p className="text-[#3A3A3A] mb-[2px]" style={{ fontSize: '0.78rem' }}>{member.name}</p>
              <p className="text-[#C8C2C1]" style={{ fontSize: '0.68rem' }}>{member.role}</p>
            </div>
          ))}
        </motion.div>

        {/* Recognition */}
        <motion.div variants={itemVariants} className="w-8 h-px bg-[#D4D4D4] mb-10" />
        <motion.p variants={itemVariants} className="label mb-6">Recognition</motion.p>

        <motion.div variants={itemVariants} className="mb-16">
          {[
            { year: '2024', title: 'Indonesia Design Award — Best Residential' },
            { year: '2023', title: 'Architizer A+ Awards — Hospitality Finalist' },
            { year: '2022', title: 'INDE.Awards — Sustainability Shortlist' },
          ].map((award, i) => (
            <div key={i} className="flex items-baseline gap-4 py-3 border-b border-[#F5F5F5]">
              <span className="text-[#C8C2C1] w-10 shrink-0" style={{ fontSize: '0.68rem' }}>{award.year}</span>
              <span className="text-[#5D5C5C]" style={{ fontSize: '0.8rem' }}>{award.title}</span>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}
