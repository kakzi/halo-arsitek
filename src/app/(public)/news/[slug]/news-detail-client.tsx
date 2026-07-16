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
    <div className="fixed inset-0 bg-white overflow-y-auto pb-32 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        
        {/* ── TITLE SECTION ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#8A8584] text-[0.65rem] md:text-xs tracking-[0.25em] uppercase font-medium">
              {newsItem.category?.name || 'News'}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
            <span className="text-[#8A8584] text-[0.65rem] md:text-xs">
              {formattedDate}
            </span>
          </div>
          
          <h1 
            className="text-2xl md:text-3xl lg:text-4xl text-[#1A1A1A]" 
            style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
          >
            {newsItem.title}
          </h1>
        </motion.div>

        {/* ── CONTAINED HERO IMAGE ── */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1] bg-[#F7F7F7] mb-16 overflow-hidden rounded-sm"
        >
          <img
            src={newsItem.coverImage}
            alt={newsItem.title}
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </motion.div>
        
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
