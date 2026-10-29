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
  const byProperty = new Map<string, Listing>();
  for (const listing of listings) {
    // Keep unit text and field boundaries so distinct apartments cannot collide.
    const identity = JSON.stringify(
      [listing.address, listing.city, listing.state, listing.zip, listing.bedrooms, listing.bathrooms, listing.sqft].map((value) => typeof value === 'string' ? value.toLowerCase() : value),
    );
    const existing = byProperty.get(identity);
    const listedTime = Date.parse(listing.listedDate);
    const existingTime = existing ? Date.parse(existing.listedDate) : NaN;
    // A valid date beats an invalid one; equal or invalid dates retain the first record.
    if (!existing || (Number.isFinite(listedTime) && (!Number.isFinite(existingTime) || listedTime > existingTime))) {
      byProperty.set(identity, listing);
    }
  }
  const { data, total, page, pageSize, totalPages } = searchListings([...byProperty.values()], query);
  return { data, meta: { total, page, pageSize, totalPages, sources, failedSources } };
}

export async function findListing(source: string, id: string, feeds?: ListingFeedAdapter[]): Promise<Listing | undefined> {
  const { listings } = await aggregateListings(feeds);
  const wantedSource = source.toUpperCase();
  return listings.find((listing) => listing.source === wantedSource && listing.id === id);
}
