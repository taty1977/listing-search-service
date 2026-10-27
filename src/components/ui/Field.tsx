import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface FieldProps {
  label: ReactNode;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={htmlFor} className="text-13 font-medium text-text-secondary">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-12 text-error-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
