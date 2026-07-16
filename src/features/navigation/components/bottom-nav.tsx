'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { navItems } from '@/shared/config/navigation.config';
import { 
  HomeIcon as HomeOutline,
  FolderIcon as FolderOutline,
  InformationCircleIcon as InfoOutline,
  NewspaperIcon as NewsOutline,
  EnvelopeIcon as EnvelopeOutline
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolid,
  FolderIcon as FolderSolid,
  InformationCircleIcon as InfoSolid,
  NewspaperIcon as NewsSolid,
  EnvelopeIcon as EnvelopeSolid
} from '@heroicons/react/24/solid';

export function BottomNav() {
  const pathname = usePathname();

  const getIconForLabel = (label: string, isActive: boolean) => {
    switch (label.toLowerCase()) {
      case 'projects': return isActive ? <FolderSolid className="w-6 h-6" /> : <FolderOutline className="w-6 h-6" />;
      case 'about': return isActive ? <InfoSolid className="w-6 h-6" /> : <InfoOutline className="w-6 h-6" />;
      case 'news': return isActive ? <NewsSolid className="w-6 h-6" /> : <NewsOutline className="w-6 h-6" />;
      case 'contact': return isActive ? <EnvelopeSolid className="w-6 h-6" /> : <EnvelopeOutline className="w-6 h-6" />;
      default: return isActive ? <HomeSolid className="w-6 h-6" /> : <HomeOutline className="w-6 h-6" />;
    }
  };

  const mobileNavItems = [
    { label: 'Home', href: '/' },
    ...navItems
  ];

  return (
    <>
      {/* ── Mobile-Only Traditional Bottom Nav ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-[#F5F5F5] pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <nav className="flex justify-around items-center h-[68px]">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-300 ${
                  isActive ? 'text-[#A67C52]' : 'text-[#8A8A8E] hover:text-black'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {getIconForLabel(item.label, isActive)}
                <span className="text-[10px] font-medium tracking-wide uppercase">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* WA CTA Floating above the bottom nav */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
        className="md:hidden fixed bottom-[88px] right-4 z-[50]"
      >
        <a
          href="https://wa.me/6285155105056"
          target="_blank"
          rel="noopener noreferrer"
          className="w-[50px] h-[50px] bg-gradient-to-tr from-[#3A3A3A] to-[#5D5C5C] border border-white/20 text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300"
          aria-label="Chat WhatsApp"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-white fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </motion.div>
    </>
  );
}
