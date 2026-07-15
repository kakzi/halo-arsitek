import { TextReveal } from '@/shared/animations/text-reveal';

export function HeroTagline() {
  return (
    <div className="text-center px-4 mt-16 max-w-5xl mx-auto">
      <TextReveal 
        text="Menciptakan Ruang, Membangun Cerita" 
        as="h1"
        className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] tracking-tight"
        delay={0.2}
      />
      <p 
        className="mt-6 text-lg md:text-xl text-[#8A8A8E] max-w-2xl mx-auto animate-[fade-in-up_1s_ease-out_1s_both]"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        Eksplorasi arsitektur kontemporer yang merespons alam, fungsi, dan gaya hidup Anda.
      </p>
    </div>
  );
}
