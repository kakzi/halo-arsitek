'use client';

import { useState, useRef, useEffect, UIEvent } from 'react';
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
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isHovered = useRef(false);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered.current && mainRef.current) {
        const next = (activeIndex + 1) % 3;
        const child = mainRef.current.children[next] as HTMLElement;
        mainRef.current.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
      }
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPos = container.scrollLeft;
    let minDiff = Infinity;
    let minIndex = 0;
    Array.from(container.children).forEach((child, idx) => {
      const childLeft = (child as HTMLElement).offsetLeft - container.offsetLeft;
      const diff = Math.abs(childLeft - scrollPos);
      if (diff < minDiff) {
        minDiff = diff;
        minIndex = idx;
      }
    });
    if (minIndex !== activeIndex) {
      setActiveIndex(minIndex);
    }
  };

  const scrollTo = (index: number) => {
    if (mainRef.current) {
      const child = mainRef.current.children[index] as HTMLElement;
      mainRef.current.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="max-w-5xl mx-auto px-6 md:px-8 pt-24 md:pt-32 pb-20"
      onMouseEnter={() => isHovered.current = true}
      onMouseLeave={() => isHovered.current = false}
      onTouchStart={() => isHovered.current = true}
      onTouchEnd={() => {
        setTimeout(() => isHovered.current = false, 3000);
      }}
    >
      
      {/* ── TOP NAVIGATION TABS ── */}
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-end border-b border-[#F5F5F5] pb-6 mb-12 gap-6">
        <h1 className="text-3xl md:text-5xl text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
          About Us
        </h1>
        <div className="flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar">
          {['Profile', 'Team', 'Recognition'].map((label, i) => (
            <button 
              key={i} 
              onClick={() => scrollTo(i)} 
              className={`text-[0.65rem] md:text-xs uppercase tracking-widest pb-2 border-b-2 transition-colors whitespace-nowrap ${activeIndex === i ? 'text-[#A67C52] border-[#A67C52]' : 'text-[#C8C2C1] border-transparent hover:text-[#8A8584]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN HORIZONTAL SLIDER ── */}
      <div 
        ref={mainRef}
        onScroll={handleScroll}
        className="w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex gap-12 md:gap-24 scroll-smooth pb-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        
        {/* SLIDE 1: ABOUT & STATS */}
        <div className="w-full shrink-0 snap-start">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <p className="text-[#3A3A3A] leading-[1.85] whitespace-pre-wrap text-base" style={{ fontFamily: 'var(--font-playfair)' }}>
                {description}
              </p>
            </div>
            
            <div className="flex-1">
              <div 
                className="relative w-full rounded-sm overflow-hidden p-8"
                style={{
                  background: 'linear-gradient(135deg, #FBF9F6 0%, #F2EBE1 50%, #E8DCC8 100%)',
                  boxShadow: '0 15px 30px -10px rgba(166,124,82,0.15)',
                  border: '1px solid rgba(200,169,126,0.3)'
                }}
              >
                <div className="absolute inset-2 border border-[#C8A97E]/20 pointer-events-none rounded-sm" />
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{ background: 'linear-gradient(45deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)' }}
                />

                <div className="relative z-10 grid grid-cols-2 gap-y-10 gap-x-6">
                  {[
                    { val: stats.years, label: 'Tahun Pengalaman' },
                    { val: stats.projects + '+', label: 'Proyek Selesai' },
                    { val: stats.awards, label: 'Penghargaan Diraih' },
                    { val: stats.clients + '+', label: 'Klien Puas' },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center justify-center text-center group">
                      <span className="text-3xl md:text-5xl text-[#4A3B2C] mb-2 transition-transform duration-500 group-hover:scale-105 group-hover:text-[#2A2118]" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {s.val}
                      </span>
                      <span className="text-[0.6rem] md:text-xs text-[#7A6B5C] uppercase tracking-[0.2em] font-medium">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDE 2: TEAM */}
        <div className="w-full shrink-0 snap-start">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] mb-4 rounded-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-[1.02] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </div>
                <p className="text-[#3A3A3A] mb-1 font-medium" style={{ fontSize: '0.85rem' }}>{member.name}</p>
                <p className="text-[#8A8584] uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SLIDE 3: RECOGNITION */}
        <div className="w-full shrink-0 snap-start">
          <div className="flex flex-col">
            {[
              { year: '2024', title: 'Indonesia Design Award — Best Residential', org: 'IDA' },
              { year: '2023', title: 'Architizer A+ Awards — Hospitality Finalist', org: 'Architizer' },
              { year: '2022', title: 'INDE.Awards — Sustainability Shortlist', org: 'INDE' },
              { year: '2021', title: 'Asia Pacific Property Awards — Architecture', org: 'APPA' },
            ].map((award, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group flex flex-col md:flex-row md:items-center gap-2 md:gap-12 py-8 border-b border-[#EAEAEA] hover:border-[#A67C52] transition-colors duration-500 cursor-default"
              >
                <span className="text-[#A67C52] font-medium w-16 shrink-0 transition-colors duration-500 group-hover:text-[#8A6541]" style={{ fontSize: '0.85rem', letterSpacing: '0.15em' }}>
                  {award.year}
                </span>
                <span className="text-[#1A1A1A] flex-1 text-lg md:text-xl transition-all duration-500 group-hover:translate-x-2 group-hover:text-[#A67C52]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {award.title}
                </span>
                <span className="text-[#8A8584] uppercase tracking-widest mt-2 md:mt-0 transition-colors duration-500 group-hover:text-[#A67C52]" style={{ fontSize: '0.65rem' }}>
                  {award.org}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
