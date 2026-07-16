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
        'bg-[#1E293B] text-[#FFFFFF] hover:bg-[#334155] focus-visible:ring-[#1E293B]',
      outline:
        'border border-[#1E293B] text-[#1E293B] bg-transparent hover:bg-[#1E293B] hover:text-[#FFFFFF] focus-visible:ring-[#1E293B]',
      ghost:
        'text-[#F5F5F5] bg-transparent hover:text-[#1E293B] focus-visible:ring-[#1E293B]',
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
