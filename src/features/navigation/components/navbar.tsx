'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { siteConfig } from '@/shared/config/site.config';
import { MenuOverlay } from './menu-overlay';
import { Magnetic } from '@/shared/animations/magnetic';

export function Navbar() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-[70] bg-white text-black border-b border-[#F5F5F5] h-[76px] md:h-[84px]"
      >
        <div className="flex justify-between items-center px-6 md:px-8 h-full">
          {/* Logo without Magnetic so it stays stable */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-70 select-none"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/logo/logo-halo-arsitek-black.png"
              alt="Halo Arsitek Logo"
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
            <span style={{
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-outfit)',
            }}>
              {siteConfig.name}
            </span>
          </Link>

          {/* Hamburger Menu Toggle */}
          <Magnetic>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-8 h-8 flex items-center justify-center focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-5 h-3">
                <span className={cn(
                  "absolute block h-[1px] w-full bg-current transition-all duration-[450ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                  isMenuOpen ? "top-[5px] -rotate-45" : "top-0"
                )} />
                <span className={cn(
                  "absolute block h-[1px] w-full bg-current transition-all duration-[450ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                  isMenuOpen ? "top-[5px] rotate-45" : "top-full"
                )} />
              </div>
            </button>
          </Magnetic>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
