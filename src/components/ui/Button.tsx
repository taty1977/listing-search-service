import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-focus disabled:pointer-events-none disabled:bg-action-disabled disabled:text-action-disabled-content',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-text-inverse hover:bg-primary-600 active:bg-primary-700',
        secondary: 'bg-secondary-900 text-text-inverse hover:bg-secondary-800',
        outline: 'border border-border-input bg-background-surface text-text-primary hover:bg-action-hover',
        ghost: 'bg-transparent text-text-secondary hover:bg-action-hover hover:text-text-primary',
        link: 'h-auto bg-transparent p-0 text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-13',
        md: 'h-10 px-4 text-15',
        lg: 'h-12 px-6 text-15',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, fullWidth, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props} />;
});
