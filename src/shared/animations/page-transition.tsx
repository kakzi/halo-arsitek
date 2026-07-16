'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom Framer-like cubic-bezier spring feel
      }}
      className="w-full min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
}
