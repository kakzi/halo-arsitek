import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { SectionHeading } from '@/shared/ui/section-heading';
import { ScrollReveal } from '@/shared/animations/scroll-reveal';
import { StatsCounter } from './stats-counter';
import { siteConfig } from '@/shared/config/site.config';

export function AboutSection() {
  return (
    <section id="tentang" className="section-padding bg-[#0A0A0A] relative z-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Image Side */}
          <ScrollReveal direction="right" className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-[#94A3B8]/10 translate-x-4 translate-y-4" />
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=1067&fit=crop"
                alt="HaloArsitek Studio"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Overlay Stat Badge */}
            <div className="absolute -bottom-6 -left-6 glass-effect p-6 flex flex-col gap-1 border-t border-[#94A3B8]/30">
              <div className="text-4xl text-[#94A3B8] font-bold">
                <StatsCounter end={siteConfig.stats.years} suffix="+" />
              </div>
              <div className="text-sm tracking-widest uppercase text-[#F5F5F5] font-outfit">
                Tahun Pengalaman
              </div>
            </div>
          </ScrollReveal>

          {/* Text Side */}
          <div className="flex flex-col items-start">
            <ScrollReveal>
              <SectionHeading 
                subtitle="Tentang Kami" 
                title="Arsitektur yang Merespons Waktu dan Alam" 
                align="left"
                className="mb-8"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-lg text-[#8A8A8E] mb-6 leading-relaxed">
                Kami adalah studio arsitektur dan desain interior yang percaya bahwa setiap ruang memiliki cerita. Sejak 2009, kami telah mendedikasikan diri untuk merancang hunian dan ruang komersial yang tidak hanya estetik, tapi juga fungsional dan berkelanjutan.
              </p>
              <p className="text-lg text-[#8A8A8E] mb-12 leading-relaxed">
                Pendekatan kami menggabungkan material lokal, pencahayaan alami, dan garis desain kontemporer untuk menciptakan karya arsitektur yang tak lekang oleh waktu.
              </p>
            </ScrollReveal>

            {/* Mini Stats */}
            <ScrollReveal delay={0.3} className="grid grid-cols-2 gap-x-12 gap-y-8 mb-12 w-full border-y border-[#2C2C2E] py-8">
              <div className="flex flex-col gap-2">
                <span className="text-4xl text-white font-playfair">
                  <StatsCounter end={siteConfig.stats.projects} suffix="+" />
                </span>
                <span className="text-sm text-[#8A8A8E] font-outfit uppercase tracking-wider">Proyek Selesai</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-4xl text-white font-playfair">
                  <StatsCounter end={siteConfig.stats.awards} suffix="+" />
                </span>
                <span className="text-sm text-[#8A8A8E] font-outfit uppercase tracking-wider">Penghargaan</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Button variant="outline" size="lg" className="group">
                Selengkapnya
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </ScrollReveal>
          </div>
          
        </div>
      </div>
    </section>
  );
}
