import type { Listing } from '@/lib/listings/types';

export const listingHref = (listing: Pick<Listing, 'source' | 'id'>) =>
  `/listings/${encodeURIComponent(listing.source)}/${encodeURIComponent(listing.id)}`;
