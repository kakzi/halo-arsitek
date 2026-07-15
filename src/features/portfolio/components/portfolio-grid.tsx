import { Button } from '@/shared/ui/button';
import { SectionHeading } from '@/shared/ui/section-heading';
import { StaggerChildren } from '@/shared/animations/stagger-children';
import { ScrollReveal } from '@/shared/animations/scroll-reveal';
import { PortfolioCard } from './portfolio-card';
import { projects } from '@/shared/lib/constants';

interface PortfolioGridProps {
  featured?: boolean;
  limit?: number;
}

export function PortfolioGrid({ featured = true, limit = 4 }: PortfolioGridProps) {
  const displayProjects = projects.slice(0, limit);

  return (
    <section id="portofolio" className="section-padding bg-[#141414]">
      <div className="container-custom">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <SectionHeading 
              subtitle="Karya Kami" 
              title="Portofolio Pilihan" 
              align="left"
              className="mb-0"
            />
            {featured && (
              <Button variant="ghost" className="hidden md:inline-flex group pb-2">
                Lihat Semua Proyek
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            )}
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {displayProjects.map((project) => (
            <div key={project.id}>
              <PortfolioCard project={project} />
            </div>
          ))}
        </StaggerChildren>

        {featured && (
          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" className="w-full">
              Lihat Semua Proyek
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
