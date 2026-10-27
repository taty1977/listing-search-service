import { normalizeListing } from '@/lib/listings/normalize';
import { searchListings } from '@/lib/listings/query';
import type { Listing, ListingQuery, ListingSearchResponse } from '@/lib/listings/types';
import { listingFeeds } from './registry';
import type { ListingFeedAdapter } from './types';

interface AggregatedListings {
  listings: Listing[];
  sources: string[];
  failedSources: string[];
}

/** Fetches every feed in parallel; a failing feed degrades the result instead of failing it. */
export async function aggregateListings(feeds: ListingFeedAdapter[] = listingFeeds): Promise<AggregatedListings> {
  const results = await Promise.allSettled(feeds.map((feed) => feed.fetchListings()));
  const byKey = new Map<string, Listing>();
  const sources: string[] = [];
  const failedSources: string[] = [];

  results.forEach((result, index) => {
    const { source } = feeds[index];
    if (result.status === 'rejected') {
      failedSources.push(source);
      return;
    }
    sources.push(source);
    for (const raw of result.value) {
      const listing = normalizeListing({ ...raw, source: raw.source || source });
      // Deduplicate within a source without merging identical IDs from different feeds.
      byKey.set(listing.key, listing);
    }
  });

  return { listings: [...byKey.values()], sources, failedSources };
}

export async function findListings(query: ListingQuery, feeds?: ListingFeedAdapter[]): Promise<ListingSearchResponse> {
  const { listings, sources, failedSources } = await aggregateListings(feeds);
  const { data, total, page, pageSize, totalPages } = searchListings(listings, query);
  return { data, meta: { total, page, pageSize, totalPages, sources, failedSources } };
}

export async function findListing(source: string, id: string, feeds?: ListingFeedAdapter[]): Promise<Listing | undefined> {
  const { listings } = await aggregateListings(feeds);
  const wantedSource = source.toUpperCase();
  return listings.find((listing) => listing.source === wantedSource && listing.id === id);
}
