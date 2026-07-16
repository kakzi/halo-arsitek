import { cn } from '@/shared/lib/utils';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  subtitle,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      {subtitle && (
        <span
          className="inline-block text-sm font-medium uppercase tracking-[0.2em] mb-4"
          style={{ color: '#1E293B', fontFamily: 'var(--font-outfit)' }}
        >
          {subtitle}
        </span>
      )}
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-playfair)', color: '#F5F5F5' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-base md:text-lg leading-relaxed max-w-2xl',
            align === 'center' && 'mx-auto'
          )}
          style={{ color: '#8A8A8E' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
