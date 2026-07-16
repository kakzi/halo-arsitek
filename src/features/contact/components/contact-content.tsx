'use client';

import { motion, Variants } from 'framer-motion';
import { Magnetic } from '@/shared/animations/magnetic';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaInstagram, FaLinkedin, FaPinterest } from 'react-icons/fa';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

interface ContactSettings {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  social: Record<string, string>;
}

export function ContactContent({ settings }: { settings: ContactSettings }) {
  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'instagram': return <FaInstagram size={15} className="mr-2" />;
      case 'linkedin': return <FaLinkedin size={15} className="mr-2" />;
      case 'pinterest': return <FaPinterest size={15} className="mr-2" />;
      default: return null;
    }
  };

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
              <a href={`mailto:${settings.email}`}
                className="text-[#3A3A3A] hover:text-[#A67C52] transition-colors text-sm inline-flex items-center gap-2">
                <FaEnvelope className="text-[#A67C52] opacity-80 mr-2" />
                {settings.email}
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="label mb-2">Phone</p>
            <Magnetic>
              <a href={`tel:${settings.phone}`}
                className="text-[#3A3A3A] hover:text-[#A67C52] transition-colors text-sm inline-flex items-center gap-2">
                <FaPhoneAlt className="text-[#A67C52] opacity-80 mr-2" />
                {settings.phone}
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="label mb-2">Studio</p>
            <p className="text-[#3A3A3A] text-sm leading-relaxed flex items-start gap-2">
              <FaMapMarkerAlt className="text-[#A67C52] opacity-80 mt-1 shrink-0 mr-2" />
              <span>{settings.address}</span>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <div className="w-8 h-px bg-[#D4D4D4] mb-6" />
            <p className="label mb-3">Follow</p>
            <div className="flex gap-5">
              {Object.entries(settings.social).map(([name, url]) => (
                <Magnetic key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="text-[#BFB8B7] hover:text-[#A67C52] transition-colors capitalize inline-flex items-center gap-1.5"
                    style={{ fontSize: '0.78rem' }}>
                    {getSocialIcon(name)}
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
