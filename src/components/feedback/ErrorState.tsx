import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load listings right now. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-error-100 bg-background-surface px-6 py-16 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-round bg-error-100 text-error-700" aria-hidden>
        <ExclamationTriangleIcon className="h-6 w-6" />
      </span>
      <h2 className="text-18 font-semibold text-text-primary">{title}</h2>
      <p className="max-w-md text-15 text-text-muted">{message}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          <ArrowPathIcon className="h-4 w-4" aria-hidden />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
