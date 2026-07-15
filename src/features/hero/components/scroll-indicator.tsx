'use client';

import { useSmoothScroll } from '@/shared/hooks/use-smooth-scroll';

export function ScrollIndicator() {
  const { scrollTo } = useSmoothScroll();

  return (
    <button 
      onClick={() => scrollTo('portofolio')}
      className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
      aria-label="Scroll ke portofolio"
    >
      <span 
        className="text-[10px] uppercase tracking-[0.3em] text-[#8A8A8E] group-hover:text-[#C8A97E] transition-colors"
        style={{ fontFamily: 'var(--font-outfit)' }}
      >
        Scroll
      </span>
      <div className="w-[1px] h-12 bg-[#2C2C2E] overflow-hidden">
        <div className="w-full h-1/2 bg-[#C8A97E] animate-[fade-in-up_1.5s_infinite]" />
      </div>
    </button>
  );
}
