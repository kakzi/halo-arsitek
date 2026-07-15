'use client';

import { motion, Variants } from 'framer-motion';
import { siteConfig } from '@/shared/config/site.config';
import { Magnetic } from '@/shared/animations/magnetic';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export function ContactContent() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-[600px] px-6 md:px-8"
      >

        <motion.h1 variants={itemVariants} className="text-2xl md:text-[2rem] mb-10"
          style={{ fontFamily: 'var(--font-playfair)' }}>
          Contact
        </motion.h1>

        <motion.div variants={itemVariants} className="mb-10">
          <p className="text-[#5D5C5C] leading-[1.8] mb-6" style={{ fontSize: '0.85rem' }}>
            Kami dengan senang hati mendiskusikan proyek Anda. Silakan hubungi kami
            untuk konsultasi awal tanpa biaya.
          </p>
        </motion.div>

        {/* Contact Details */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <p className="label mb-2">Email</p>
            <Magnetic>
              <a href={`mailto:${siteConfig.contact.email}`}
                className="text-[#3A3A3A] hover:text-[#A67C52] transition-colors text-sm inline-block">
                {siteConfig.contact.email}
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="label mb-2">Phone</p>
            <Magnetic>
              <a href={`tel:${siteConfig.contact.phone}`}
                className="text-[#3A3A3A] hover:text-[#A67C52] transition-colors text-sm inline-block">
                {siteConfig.contact.phone}
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="label mb-2">Studio</p>
            <p className="text-[#3A3A3A] text-sm leading-relaxed">
              {siteConfig.contact.address}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <div className="w-8 h-px bg-[#D4D4D4] mb-6" />
            <p className="label mb-3">Follow</p>
            <div className="flex gap-5">
              {Object.entries(siteConfig.social).map(([name, url]) => (
                <Magnetic key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="text-[#BFB8B7] hover:text-[#A67C52] transition-colors capitalize inline-block"
                    style={{ fontSize: '0.78rem' }}>
                    {name}
                  </a>
                </Magnetic>
              ))}
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
