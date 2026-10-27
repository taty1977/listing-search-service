import type { RawListing } from '@/lib/listings/types';

/**
 * Contract every MLS integration implements. Adding a new feed means writing an adapter that
 * fetches the provider's payload and maps it to `RawListing`; normalization, de-duplication of
 * keys, searching and paging are handled downstream by `listingRepository`.
 */
export interface ListingFeedAdapter {
  /** Feed identifier, e.g. "MLS_A". Stored on every listing as `source`. */
  readonly source: string;
  fetchListings(): Promise<RawListing[]>;
}
