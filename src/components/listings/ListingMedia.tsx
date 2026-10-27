import { cn } from '@/lib/utils/cn';
import type { Listing } from '@/lib/listings/types';
import { PropertyTypeIcon } from './PropertyTypeIcon';

/**
 * Feeds do not provide photos yet, so render a branded placeholder keyed by property type.
 * Replace with <Image> once a media URL is part of the listing model.
 */
export function ListingMedia({ listing, className }: { listing: Pick<Listing, 'propertyType'>; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-secondary-800 via-secondary-700 to-primary-700 text-primary-100',
        className,
      )}
    >
      <PropertyTypeIcon type={listing.propertyType} className="h-12 w-12" />
    </div>
  );
}
