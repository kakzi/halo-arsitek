'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
// import { teamMembers } from '@/shared/lib/constants';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface Stats {
  years: string;
  projects: string;
  awards: string;
  clients: string;
}

export function AboutContent({ teamMembers, description, stats }: { teamMembers: TeamMember[], description: string, stats: Stats }) {
  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pb-32">
      {/* Sticky solid white block to protect the Navbar logo from scrolling text */}
      <div className="sticky top-0 z-40 w-full h-[70px] md:h-[90px] bg-white" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="container-narrow px-6 md:px-8 py-4"
      >

        <motion.h1 variants={itemVariants} className="text-2xl md:text-[2rem] mb-12"
          style={{ fontFamily: 'var(--font-playfair)' }}>
          About
        </motion.h1>

        {/* Description */}
        <motion.div variants={itemVariants} className="max-w-[560px] mb-16">
          <p className="text-[#5D5C5C] leading-[1.85] mb-5 whitespace-pre-wrap" style={{ fontSize: '0.84rem' }}>
            {description}
          </p>
        </motion.div>

        {/* ── PREMIUM STATS CARD ── */}
        <motion.div 
          variants={itemVariants}
          className="relative w-full max-w-2xl rounded-sm mb-20 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FBF9F6 0%, #F2EBE1 50%, #E8DCC8 100%)',
            boxShadow: '0 15px 30px -10px rgba(166,124,82,0.15)',
            border: '1px solid rgba(200,169,126,0.3)'
          }}
        >
          {/* Inner framing line (Museum/Editorial style) */}
          <div className="absolute inset-2 border border-[#C8A97E]/20 pointer-events-none rounded-sm" />
          
          {/* Subtle lighting overlay to simulate metallic shine */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)'
            }}
          />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 p-8">
            
            {/* Stat Item 1 */}
            <div className="flex flex-col items-center justify-center text-center group">
              <span className="text-3xl md:text-4xl text-[#4A3B2C] mb-2 transition-transform duration-500 group-hover:scale-105 group-hover:text-[#2A2118]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {stats.years}
              </span>
              <span className="text-[0.6rem] md:text-[0.65rem] text-[#7A6B5C] uppercase tracking-[0.2em] font-medium">Tahun<br/>Pengalaman</span>
            </div>
            
            {/* Stat Item 2 */}
            <div className="flex flex-col items-center justify-center text-center group">
              <span className="text-3xl md:text-4xl text-[#4A3B2C] mb-2 transition-transform duration-500 group-hover:scale-105 group-hover:text-[#2A2118]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {stats.projects}+
              </span>
              <span className="text-[0.6rem] md:text-[0.65rem] text-[#7A6B5C] uppercase tracking-[0.2em] font-medium">Proyek<br/>Selesai</span>
            </div>

            {/* Stat Item 3 */}
            <div className="flex flex-col items-center justify-center text-center group">
              <span className="text-3xl md:text-4xl text-[#4A3B2C] mb-2 transition-transform duration-500 group-hover:scale-105 group-hover:text-[#2A2118]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {stats.awards}
              </span>
              <span className="text-[0.6rem] md:text-[0.65rem] text-[#7A6B5C] uppercase tracking-[0.2em] font-medium">Penghargaan<br/>Diraih</span>
            </div>

            {/* Stat Item 4 */}
            <div className="flex flex-col items-center justify-center text-center group">
              <span className="text-3xl md:text-4xl text-[#4A3B2C] mb-2 transition-transform duration-500 group-hover:scale-105 group-hover:text-[#2A2118]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {stats.clients}+
              </span>
              <span className="text-[0.6rem] md:text-[0.65rem] text-[#7A6B5C] uppercase tracking-[0.2em] font-medium">Klien<br/>Puas</span>
            </div>

          </div>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="w-8 h-px bg-[#D4D4D4] mb-10" />

        {/* Team */}
        <motion.p variants={itemVariants} className="label mb-8">Team</motion.p>

        <motion.div variants={itemVariants} className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-16 max-w-2xl">
          {teamMembers.map((member) => (
            <div key={member.id}>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] mb-3 rounded-sm">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-[1.02] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>
              <p className="text-[#3A3A3A] mb-[2px]" style={{ fontSize: '0.7rem' }}>{member.name}</p>
              <p className="text-[#C8C2C1]" style={{ fontSize: '0.6rem' }}>{member.role}</p>
            </div>
          ))}
        </motion.div>

        {/* Recognition */}
        <motion.div variants={itemVariants} className="w-8 h-px bg-[#D4D4D4] mb-10" />
        <motion.p variants={itemVariants} className="label mb-6">Recognition</motion.p>

        <motion.div variants={itemVariants} className="mb-16 max-w-2xl">
          {[
            { year: '2024', title: 'Indonesia Design Award — Best Residential' },
            { year: '2023', title: 'Architizer A+ Awards — Hospitality Finalist' },
            { year: '2022', title: 'INDE.Awards — Sustainability Shortlist' },
          ].map((award, i) => (
            <div key={i} className="flex items-baseline gap-4 py-2 border-b border-[#F5F5F5]">
              <span className="text-[#C8C2C1] w-10 shrink-0" style={{ fontSize: '0.6rem' }}>{award.year}</span>
              <span className="text-[#5D5C5C]" style={{ fontSize: '0.75rem' }}>{award.title}</span>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
}
