'use client';

import { useState, useEffect } from 'react';
import { ScrollReveal } from '@/shared/animations/scroll-reveal';
import { testimonials } from '@/shared/lib/constants';
import { cn } from '@/shared/lib/utils';

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="py-24 md:py-32 bg-[#141414] overflow-hidden">
      <div className="container-custom">
        <ScrollReveal>
          <div className="relative max-w-4xl mx-auto px-4 md:px-12 text-center">
            
            {/* Quote Icon */}
            <div className="text-6xl md:text-8xl text-[#C8A97E] opacity-20 font-playfair leading-none mb-8">
              "
            </div>

            {/* Slider Track */}
            <div className="relative min-h-[250px] md:min-h-[200px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    'absolute top-0 left-0 w-full transition-all duration-500 ease-in-out',
                    index === currentIndex 
                      ? 'opacity-100 translate-x-0 pointer-events-auto' 
                      : index < currentIndex
                        ? 'opacity-0 -translate-x-12 pointer-events-none'
                        : 'opacity-0 translate-x-12 pointer-events-none'
                  )}
                >
                  <blockquote className="text-2xl md:text-3xl lg:text-4xl text-white font-playfair italic leading-relaxed mb-8">
                    {testimonial.quote}
                  </blockquote>
                  <div>
                    <div className="text-[#C8A97E] font-medium tracking-wide">
                      {testimonial.name}
                    </div>
                    <div className="text-[#8A8A8E] text-sm mt-1">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-12">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-[#2C2C2E] flex items-center justify-center text-white hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors focus:outline-none"
                aria-label="Previous testimonial"
              >
                ←
              </button>
              
              <div className="flex gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (isAnimating) return;
                      setCurrentIndex(index);
                    }}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      index === currentIndex ? 'w-8 bg-[#C8A97E]' : 'bg-[#2C2C2E] hover:bg-[#8A8A8E]'
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-[#2C2C2E] flex items-center justify-center text-white hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors focus:outline-none"
                aria-label="Next testimonial"
              >
                →
              </button>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
