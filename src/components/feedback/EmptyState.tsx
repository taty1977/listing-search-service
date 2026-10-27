import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-input bg-background-surface px-6 py-16 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-round bg-primary-50 text-primary-600" aria-hidden>
        {icon ?? <MagnifyingGlassIcon className="h-6 w-6" />}
      </span>
      <h2 className="text-18 font-semibold text-text-primary">{title}</h2>
      {description ? <p className="max-w-md text-15 text-text-muted">{description}</p> : null}
      {action}
    </div>
  );
}
