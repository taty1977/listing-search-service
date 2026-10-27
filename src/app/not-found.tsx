import Link from 'next/link';
import { EmptyState } from '@/components/feedback';
import { buttonVariants } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist."
        action={
          <Link href="/" className={buttonVariants({ variant: 'outline' })}>
            Back to search
          </Link>
        }
      />
    </div>
  );
}
