'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export function NewsDetailClient({ newsItem }: { newsItem: any }) {
  const formattedDate = newsItem.createdAt 
    ? format(new Date(newsItem.createdAt), 'dd MMMM yyyy')
    : '';

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pb-32">
      
      {/* ── HERO SECTION ── */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-[#F7F7F7]">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={newsItem.coverImage}
            alt={newsItem.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        
        <div className="absolute bottom-10 left-6 md:left-12 right-6 md:right-12 z-20 max-w-4xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 mb-4"
          >
            <span className="text-white/90 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
              {newsItem.category?.name || 'News'}
            </span>
            <span className="w-10 h-[1px] bg-white/50" />
            <span className="text-white/80 text-xs md:text-sm">
              {formattedDate}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl lg:text-6xl text-white font-medium drop-shadow-xl"
            style={{ letterSpacing: '-0.01em', lineHeight: 1.2, fontFamily: 'var(--font-playfair)' }}
          >
            {newsItem.title}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
        
        {/* ── CONTENT ── */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="prose prose-lg max-w-none text-[#3A3A3A] leading-relaxed prose-headings:font-playfair prose-headings:font-normal prose-a:text-[#A67C52] hover:prose-a:text-[#8A633B] prose-img:rounded-md"
          dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }}
        />

        {/* ── CALL TO ACTION ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center border-t border-[#E5E5E5] pt-20 mt-32"
        >
          <Link 
            href="/news"
            className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-[#1A1A1A] hover:opacity-60 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
            Back to News
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
