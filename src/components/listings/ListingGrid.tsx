import type { Listing } from '@/lib/listings/types';
import { ListingCard } from './ListingCard';
import { ListingCardSkeleton } from './ListingCardSkeleton';

const gridClassName = 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3';

export function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <ul className={gridClassName}>
      {listings.map((listing) => (
        <li key={listing.key}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={gridClassName} role="status" aria-live="polite" aria-label="Loading listings">
      {Array.from({ length: count }, (_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  );
}
