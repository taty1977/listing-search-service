'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import { EmptyState, ErrorState } from '@/components/feedback';
import { ListingGrid, ListingGridSkeleton, Pagination } from '@/components/listings';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { filtersReset, pageChanged, selectListingQuery } from '@/store/filtersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSearchListingsQuery } from '@/store/listingsApi';
import { SortSelect } from './SortSelect';

const errorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { error?: { message?: string } } }).data;
    if (data?.error?.message) return data.error.message;
  }
  return undefined;
};

export function SearchResults() {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectListingQuery);
  const { data, error, isLoading, isFetching, isError, refetch } = useSearchListingsQuery(query);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousPage = useRef(query.page);

  // Move focus to the results heading on page change for keyboard and screen-reader users.
  useEffect(() => {
    if (previousPage.current !== query.page && data) headingRef.current?.focus();
    previousPage.current = query.page;
  }, [query.page, data]);

  const total = data?.meta.total ?? 0;

  return (
    <section aria-labelledby="results-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="results-heading"
          ref={headingRef}
          tabIndex={-1}
          aria-live="polite"
          className="text-18 font-semibold text-text-primary focus:outline-none"
        >
          {isLoading ? 'Searching listings…' : `${total} ${total === 1 ? 'property' : 'properties'} found`}
        </h2>
        <SortSelect />
      </div>

      {data?.meta.failedSources.length ? (
        <p className="flex items-center gap-2 rounded-md bg-warning-100 px-3 py-2 text-13 text-warning-700" role="status">
          <ExclamationTriangleIcon className="h-4 w-4 shrink-0" aria-hidden />
          Some feeds are unavailable ({data.meta.failedSources.join(', ')}). Results may be incomplete.
        </p>
      ) : null}

      {isLoading ? (
        <ListingGridSkeleton />
      ) : isError ? (
        <ErrorState message={errorMessage(error)} onRetry={refetch} />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="No properties match your search"
          description="Try a different keyword or location, widen the price range, or remove some filters."
          action={
            <Button variant="outline" onClick={() => dispatch(filtersReset())}>
              Clear search and filters
            </Button>
          }
        />
      ) : (
        <div className={cn('flex flex-col gap-6 transition-opacity', isFetching && 'opacity-60')} aria-busy={isFetching}>
          <ListingGrid listings={data.data} />
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={(page) => dispatch(pageChanged(page))}
          />
        </div>
      )}
    </section>
  );
}
