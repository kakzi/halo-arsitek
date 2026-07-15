import { cn } from '@/shared/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-[#C8A97E] text-[#0A0A0A] hover:bg-[#E8C89E] focus-visible:ring-[#C8A97E]',
      outline:
        'border border-[#C8A97E] text-[#C8A97E] bg-transparent hover:bg-[#C8A97E] hover:text-[#0A0A0A] focus-visible:ring-[#C8A97E]',
      ghost:
        'text-[#F5F5F5] bg-transparent hover:text-[#C8A97E] focus-visible:ring-[#C8A97E]',
    };

    const sizes = {
      sm: 'text-sm px-4 py-2 rounded-md',
      md: 'text-sm px-6 py-3 rounded-md',
      lg: 'text-base px-8 py-4 rounded-md',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={{ fontFamily: 'var(--font-outfit)' }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
