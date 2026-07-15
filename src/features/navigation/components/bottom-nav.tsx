'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { navItems } from '@/shared/config/navigation.config';

export function BottomNav() {
  return (
    <>
      {/* ── Fixed Bottom-left Nav ── */}
      <div 
        className="fixed bottom-0 md:bottom-8 left-0 md:left-12 w-full md:w-auto h-20 md:h-auto z-50 pl-6 md:pl-0 flex items-center"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 98%)', 
          maskImage: 'linear-gradient(to right, black 80%, transparent 98%)' 
        }}
      >
        <nav className="flex gap-2 md:gap-12 overflow-x-auto hide-scrollbar items-center snap-x w-full" style={{ WebkitTapHighlightColor: 'transparent' }}>
          {navItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.5 + i * 0.1 }}
              className="snap-start shrink-0"
            >
              <Link
                href={item.href}
                className="text-black/70 hover:text-black md:text-white/60 md:hover:text-white mix-blend-difference transition-all duration-500 relative group font-medium flex items-center justify-center gap-2 px-6 py-2.5 md:px-0 md:py-0 bg-white/80 backdrop-blur-md md:bg-transparent rounded-full md:rounded-none border border-black/5 md:border-none shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:shadow-none"
                style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="hidden md:block w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-4" />
                {item.label}
              </Link>
            </motion.div>
          ))}
          {/* Spacer so the last item can scroll past the WA button */}
          <div className="w-24 shrink-0 md:hidden" />
        </nav>
      </div>

      {/* Mobile Only: Sticky WhatsApp CTA */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.8 }}
        className="md:hidden fixed bottom-4 right-4 h-12 flex items-center z-50"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <a
          href="https://wa.me/6285155105056"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gradient-to-tr from-black/80 to-black/40 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-black/80 hover:scale-105 transition-all duration-300"
          aria-label="Chat WhatsApp"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="text-white fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </motion.div>
    </>
  );
}
