import { HeroScene } from './hero-scene';
import { HeroTagline } from './hero-tagline';
import { ScrollIndicator } from './scroll-indicator';

export function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0A0A0A]">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <HeroTagline />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <ScrollIndicator />
      </div>

      {/* Gradient Overlay to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
