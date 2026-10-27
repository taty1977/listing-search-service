import type { RawListing } from '@/lib/listings/types';
import type { ListingFeedAdapter } from './types';

/** In-memory adapter used by the mock API (and tests) in place of a live MLS connection. */
export function createStaticFeed(source: string, records: RawListing[]): ListingFeedAdapter {
  return {
    source,
    fetchListings: async () => records.filter((record) => record.source === source),
  };
}
