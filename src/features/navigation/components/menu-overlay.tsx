'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { navItems } from '@/shared/config/navigation.config';
import { siteConfig } from '@/shared/config/site.config';

const overlayVariants: Variants = {
  initial: { opacity: 0, clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
  animate: { opacity: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
  exit: { opacity: 0, clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }
};

const linkContainerVariants: Variants = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } }
};

const linkVariants: Variants = {
  initial: { y: '100%', rotate: 5, opacity: 0 },
  animate: { y: 0, rotate: 0, opacity: 1, transition: { type: 'spring', damping: 20, stiffness: 100 } },
  exit: { y: '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }
};

interface MenuOverlayProps {
  onClose: () => void;
}

export function MenuOverlay({ onClose }: MenuOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div 
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-40 bg-[#1A1A1A] text-white flex flex-col justify-center px-8 md:px-16"
    >
      <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-16 pt-20">

        {/* Links */}
        <motion.nav 
          variants={linkContainerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col gap-4"
        >
          {navItems.map((item, i) => (
            <div key={item.label} className="overflow-hidden">
              <motion.div variants={linkVariants}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-4xl md:text-6xl text-white hover:text-[#94A3B8] transition-colors duration-300 flex items-center gap-6 group"
                  style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '-0.03em' }}
                >
                  <span 
                    className="text-[0.75rem] text-[#808080] group-hover:text-[#94A3B8] transition-colors tracking-widest mt-2"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
              </motion.div>
            </div>
          ))}
        </motion.nav>

        {/* Contact Info */}
        <motion.div 
          variants={linkVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="md:self-end pb-4"
        >
          <p className="text-[#808080] mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-outfit)' }}>
            Get in touch
          </p>
          <a href={`mailto:${siteConfig.contact.email}`} className="text-white hover:text-[#94A3B8] transition-colors block text-base mb-2">
            {siteConfig.contact.email}
          </a>
          <a href={`tel:${siteConfig.contact.phone}`} className="text-[#808080] hover:text-white transition-colors block text-sm">
            {siteConfig.contact.phone}
          </a>
          
          <div className="flex gap-4 mt-8">
            {Object.entries(siteConfig.social).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                className="text-[#808080] hover:text-[#94A3B8] transition-colors text-xs uppercase tracking-widest"
              >
                {platform}
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
