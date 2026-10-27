import sampleListings from '@/data/sample_listings.json';
import type { RawListing } from '@/lib/listings/types';
import { createStaticFeed } from './staticFeed';
import type { ListingFeedAdapter } from './types';

const records = sampleListings as RawListing[];

/**
 * Registered MLS feeds. Swap a static feed for a live adapter (e.g. one that calls a RESO Web API
 * endpoint) without touching the API routes or the UI.
 */
export const listingFeeds: ListingFeedAdapter[] = [createStaticFeed('MLS_A', records), createStaticFeed('MLS_B', records)];
