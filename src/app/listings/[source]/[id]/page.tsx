import { Suspense } from 'react';
import { ListingDetailSkeleton } from '@/components/listings';
import { ListingDetailView } from '@/features/listing-detail';

export default function ListingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Params are request-time data with Cache Components, so reading them must suspend. */}
      <Suspense fallback={<ListingDetailSkeleton />}>
        <ListingDetailView />
      </Suspense>
    </div>
  );
}
