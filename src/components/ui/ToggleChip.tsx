import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ToggleChipProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

/** Checkbox styled as a pill. Styling follows the native checked state, so it works with RHF `register`. */
export const ToggleChip = forwardRef<HTMLInputElement, ToggleChipProps>(function ToggleChip(
  { label, className, ...props },
  ref,
) {
  return (
    <label className={cn('relative inline-flex', className)}>
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className="inline-flex cursor-pointer select-none items-center rounded-round border border-border-input bg-background-surface px-3 py-1 text-13 font-medium text-text-secondary transition-colors hover:bg-action-hover peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 peer-focus-visible:ring-2 peer-focus-visible:ring-action-focus">
        {label}
      </span>
    </label>
  );
});
