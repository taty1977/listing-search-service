import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-round px-2 py-[2px] text-12 font-semibold uppercase tracking-wide',
  {
    variants: {
      tone: {
        neutral: 'bg-chip-background text-text-secondary',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-700',
        error: 'bg-error-100 text-error-700',
        info: 'bg-info-100 text-info-700',
        inverse: 'bg-secondary-900 text-text-inverse',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
