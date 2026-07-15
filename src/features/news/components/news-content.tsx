'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const newsItems = [
  {
    id: '1',
    title: 'HaloArsitek Meraih Penghargaan Indonesia Design Award 2024',
    excerpt: 'Proyek Villa Bali Modern kami terpilih sebagai pemenang kategori Best Residential pada ajang Indonesia Design Award 2024.',
    date: '15 Nov 2024',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    category: 'Award',
  },
  {
    id: '2',
    title: 'Kolaborasi dengan Material Lokal: Filosofi Desain Kami',
    excerpt: 'Artikel tentang bagaimana kami mengintegrasikan material tradisional Indonesia ke dalam desain arsitektur kontemporer.',
    date: '28 Sep 2024',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    category: 'Publication',
  },
  {
    id: '3',
    title: 'Resort & Spa Lombok Resmi Beroperasi',
    excerpt: 'Proyek resort boutique 12 villa di Senggigi, Lombok resmi dibuka untuk umum setelah 18 bulan konstruksi.',
    date: '10 Jul 2024',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
    category: 'Completion',
  },
  {
    id: '4',
    title: 'Wawancara Eksklusif: Arsitektur Berkelanjutan di Indonesia',
    excerpt: 'Principal Architect kami berbagi pandangan tentang masa depan arsitektur hijau di Indonesia bersama majalah ArchDaily.',
    date: '02 May 2024',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
    category: 'Press',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export function NewsContent() {
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
          News
        </motion.h1>

        <div className="space-y-0">
          {newsItems.map((item) => (
            <motion.article 
              key={item.id}
              variants={itemVariants}
              className="group grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 md:gap-8 py-8 border-b border-[#F0F0F0] first:pt-0 cursor-pointer"
            >
              
              {/* Thumbnail */}
              <div className="relative aspect-[3/2] md:aspect-[4/3] overflow-hidden bg-[#F7F7F7] rounded-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  sizes="200px"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className="label">{item.category}</span>
                  <span className="w-3 h-px bg-[#D4D4D4]" />
                  <span className="text-[#C8C2C1]" style={{ fontSize: '0.65rem' }}>{item.date}</span>
                </div>
                <h2 className="text-base md:text-lg group-hover:text-[#1A1A1A] transition-colors mb-2"
                  style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400 }}>
                  {item.title}
                </h2>
                <p className="text-[#9A9A9A] leading-relaxed" style={{ fontSize: '0.78rem' }}>
                  {item.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
