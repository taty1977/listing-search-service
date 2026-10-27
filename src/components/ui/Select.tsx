import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { inputVariants, type InputProps } from './Input';

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    Pick<InputProps, 'size' | 'invalid'> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, size, invalid, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(inputVariants({ size, invalid }), 'cursor-pointer appearance-none bg-no-repeat pr-8', className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2364748b'%3E%3Cpath d='M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z'/%3E%3C/svg%3E\")",
        backgroundPosition: 'right 8px center',
        backgroundSize: '18px',
      }}
      {...props}
    >
      {children}
    </select>
  );
});
