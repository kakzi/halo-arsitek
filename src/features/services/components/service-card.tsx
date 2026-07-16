import type { Service } from '@/shared/lib/constants';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group p-8 md:p-10 border border-[#2C2C2E] bg-[#0A0A0A] hover:bg-[#1C1C1E] transition-colors duration-500 flex flex-col h-full">
      <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#2C2C2E] group-hover:border-[#64748B]/50 flex items-center justify-center text-2xl mb-8 transition-colors duration-500">
        {service.icon}
      </div>
      
      <h3 className="text-xl md:text-2xl text-white font-playfair font-bold mb-4 group-hover:text-[#F5F5F5] transition-colors duration-300">
        {service.title}
      </h3>
      
      <p className="text-[#8A8A8E] text-base leading-relaxed flex-grow">
        {service.description}
      </p>
      
      <div className="mt-8 overflow-hidden">
        <span className="inline-flex items-center text-[#64748B] text-sm font-outfit font-medium uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Pelajari Lebih Lanjut <span className="ml-2">→</span>
        </span>
      </div>
    </div>
  );
}
