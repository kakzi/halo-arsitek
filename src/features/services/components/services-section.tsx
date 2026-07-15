import { SectionHeading } from '@/shared/ui/section-heading';
import { StaggerChildren } from '@/shared/animations/stagger-children';
import { ScrollReveal } from '@/shared/animations/scroll-reveal';
import { ServiceCard } from './service-card';
import { services } from '@/shared/lib/constants';

export function ServicesSection() {
  return (
    <section id="layanan" className="section-padding bg-[#0A0A0A]">
      <div className="container-custom">
        <ScrollReveal>
          <SectionHeading 
            subtitle="Keahlian Kami" 
            title="Layanan Profesional" 
            description="Solusi desain komprehensif dari konsep hingga konstruksi, disesuaikan dengan kebutuhan unik Anda."
          />
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id}>
              <ServiceCard service={service} />
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
