'use client';

import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { EmptyState, ErrorState } from '@/components/feedback';
import { ListingDetail, ListingDetailSkeleton } from '@/components/listings';
import { buttonVariants } from '@/components/ui';
import { useGetListingQuery } from '@/store/listingsApi';

const isNotFound = (error: unknown) =>
  Boolean(error && typeof error === 'object' && 'status' in error && (error as { status: unknown }).status === 404);

export function ListingDetailView() {
  const { source, id } = useParams<{ source: string; id: string }>();
  const { data, error, isLoading, isError, refetch } = useGetListingQuery({
    source: decodeURIComponent(source),
    id: decodeURIComponent(id),
  });

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'self-start' })}>
        <ArrowLeftIcon className="h-4 w-4" aria-hidden />
        Back to search
      </Link>

      {isLoading ? (
        <ListingDetailSkeleton />
      ) : isError && isNotFound(error) ? (
        <EmptyState
          icon={<HomeIcon className="h-6 w-6" />}
          title="Listing not found"
          description="This listing may have been removed from its MLS feed."
          action={
            <Link href="/" className={buttonVariants({ variant: 'outline' })}>
              Browse listings
            </Link>
          }
        />
      ) : isError || !data ? (
        <ErrorState title="Unable to load this listing" message="Please check your connection and try again." onRetry={refetch} />
      ) : (
        <ListingDetail listing={data} />
      )}
    </div>
  );
}
