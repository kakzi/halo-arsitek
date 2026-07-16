'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { navItems } from '@/shared/config/navigation.config';
import { siteConfig } from '@/shared/config/site.config';
import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaInstagram, FaLinkedin, FaPinterest } from 'react-icons/fa';

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
      className="fixed inset-0 z-[60] bg-[#1A1A1A] text-white flex flex-col justify-center px-8 md:px-16"
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
          className="md:self-end pb-4 mt-8 md:mt-0 flex flex-col"
        >
          <p className="text-[#808080] mb-4" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-outfit)' }}>
            Get in touch
          </p>
          <a href={`mailto:${siteConfig.contact.email}`} className="text-white hover:text-[#A67C52] transition-colors flex items-center gap-3 text-base mb-3 group">
            <FaEnvelope className="w-4 h-4 text-[#808080] group-hover:text-[#A67C52] transition-colors" />
            {siteConfig.contact.email}
          </a>
          <a href={`tel:${siteConfig.contact.phone}`} className="text-[#808080] hover:text-white transition-colors flex items-center gap-3 text-sm">
            <FaPhoneAlt className="w-4 h-4" />
            {siteConfig.contact.phone}
          </a>

          <div className="flex flex-wrap gap-6 mt-10 mb-10">
            {Object.entries(siteConfig.social).map(([platform, url]) => {
              const Icon = platform.toLowerCase() === 'instagram' ? FaInstagram :
                platform.toLowerCase() === 'linkedin' ? FaLinkedin :
                  platform.toLowerCase() === 'pinterest' ? FaPinterest : null;
              return (
                <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                  className="text-[#808080] hover:text-[#A67C52] transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {platform}
                </a>
              );
            })}
          </div>

          <a
            href="https://wa.me/6285155105056"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#A67C52] hover:bg-[#8A6541] text-white py-4 px-8 rounded-sm transition-colors uppercase tracking-widest text-xs font-medium"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            <FaWhatsapp className="w-4 h-4" />
            Consult Now
          </a>
        </motion.div>

      </div>
    </motion.div>
  );
}
