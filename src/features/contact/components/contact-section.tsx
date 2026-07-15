import { SectionHeading } from '@/shared/ui/section-heading';
import { ScrollReveal } from '@/shared/animations/scroll-reveal';
import { ContactForm } from './contact-form';
import { siteConfig } from '@/shared/config/site.config';

export function ContactSection() {
  return (
    <section id="kontak" className="py-24 md:py-32 bg-[#0A0A0A] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#141414] to-transparent h-1/2 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          <div className="lg:col-span-5 lg:pr-12">
            <ScrollReveal direction="right">
              <SectionHeading 
                subtitle="Mulai Proyek" 
                title="Siap Mewujudkan Hunian Impian Anda?" 
                align="left"
                className="mb-8"
              />
              <p className="text-[#8A8A8E] text-lg mb-10 leading-relaxed">
                Ceritakan visi Anda, dan mari kita wujudkan bersama. Hubungi kami untuk konsultasi awal gratis.
              </p>
              
              <div className="flex flex-col gap-6">
                <div>
                  <div className="text-sm uppercase tracking-[0.1em] text-[#8A8A8E] font-outfit mb-2">Email</div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-xl text-white hover:text-[#C8A97E] transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </div>
                
                <div className="w-full h-[1px] bg-[#2C2C2E]/50" />
                
                <div>
                  <div className="text-sm uppercase tracking-[0.1em] text-[#8A8A8E] font-outfit mb-2">Telepon / WhatsApp</div>
                  <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="text-xl text-white hover:text-[#C8A97E] transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
          
          <div className="lg:col-span-7 bg-[#1C1C1E] p-8 md:p-12 border border-[#2C2C2E]/50 rounded-lg">
            <ScrollReveal delay={0.2}>
              <ContactForm />
            </ScrollReveal>
          </div>
          
        </div>
      </div>
    </section>
  );
}
