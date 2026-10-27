import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export const inputVariants = cva(
  'w-full rounded-md border bg-background-surface text-text-primary placeholder:text-text-muted transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-action-focus disabled:bg-filled-input-bg disabled:text-text-disabled',
  {
    variants: {
      size: { sm: 'h-8 px-3 text-13', md: 'h-10 px-3 text-15', lg: 'h-12 px-4 text-15' },
      invalid: { true: 'border-error-500 focus:border-error-500', false: 'border-border-input' },
      withIcon: { true: 'pl-10' },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'withIcon'> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, invalid, icon, ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(inputVariants({ size, invalid, withIcon: Boolean(icon) }), className)}
      {...props}
    />
  );
  if (!icon) return input;
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted" aria-hidden>
        {icon}
      </span>
      {input}
    </div>
  );
});
