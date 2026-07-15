import Image from 'next/image';
import type { Project } from '@/shared/lib/constants';

interface PortfolioCardProps {
  project: Project;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <div className="group relative aspect-[4/5] w-full overflow-hidden cursor-pointer">
      <Image
        src={project.coverImage}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <span className="inline-block text-[#C8A97E] text-xs font-medium uppercase tracking-[0.2em] font-outfit mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {project.category} — {project.year}
        </span>
        <h3 className="text-2xl md:text-3xl text-white font-playfair font-bold mb-2">
          {project.title}
        </h3>
        <p className="text-[#8A8A8E] text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
          <span className="block w-4 h-[1px] bg-[#C8A97E]" />
          {project.location}
        </p>
      </div>
    </div>
  );
}
