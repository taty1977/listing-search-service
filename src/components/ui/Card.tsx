import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const cardVariants = cva('overflow-hidden rounded-lg border border-border-subtle bg-background-surface', {
  variants: {
    elevation: { flat: '', raised: 'shadow-card' },
    interactive: { true: 'transition-shadow hover:shadow-card-hover focus-within:shadow-card-hover' },
    padding: { none: '', md: 'p-4', lg: 'p-6' },
  },
  defaultVariants: { elevation: 'raised', padding: 'none' },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, elevation, interactive, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ elevation, interactive, padding }), className)} {...props} />;
}
