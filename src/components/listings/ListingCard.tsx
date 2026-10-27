import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { Badge, Card } from '@/components/ui';
import { formatCityLine, formatListedDate, formatPrice } from '@/lib/listings/format';
import { PROPERTY_TYPE_LABELS, type Listing } from '@/lib/listings/types';
import { listingHref } from './listingHref';
import { ListingFacts } from './ListingFacts';
import { ListingMedia } from './ListingMedia';
import { StatusBadge } from './StatusBadge';

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card interactive className="group relative flex h-full flex-col" data-testid="listing-card">
      <div className="relative">
        <ListingMedia listing={listing} className="aspect-[16/10] w-full" />
        <div className="absolute left-3 top-3 flex gap-2">
          <StatusBadge status={listing.status} />
        </div>
        <Badge tone="inverse" className="absolute right-3 top-3">
          {listing.source}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-24 font-bold leading-28 text-text-primary">{formatPrice(listing.price)}</p>
          <span className="pt-1 text-12 font-medium text-text-muted">{PROPERTY_TYPE_LABELS[listing.propertyType]}</span>
        </div>
        <ListingFacts listing={listing} />
        <h3 className="text-15 font-semibold text-text-primary">
          {/* Stretched link: the whole card is clickable while keeping a single focusable element. */}
          <Link
            href={listingHref(listing)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:text-primary-600"
          >
            {listing.address}
          </Link>
        </h3>
        <p className="flex items-center gap-1 text-13 text-text-muted">
          <MapPinIcon className="h-4 w-4 shrink-0" aria-hidden />
          {formatCityLine(listing)}
        </p>
        <p className="mt-auto border-t border-divider pt-3 text-12 text-text-muted">
          Listed {formatListedDate(listing.listedDate)}
        </p>
      </div>
    </Card>
  );
}
