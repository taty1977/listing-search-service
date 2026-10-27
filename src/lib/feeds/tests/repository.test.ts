import { describe, expect, it } from 'vitest';
import { rawListing } from '@/test/fixtures';
import { aggregateListings, findListing, findListings } from '../repository';
import { createStaticFeed } from '../staticFeed';
import type { ListingFeedAdapter } from '../types';

const feedA = createStaticFeed('MLS_A', [rawListing({ id: '1', source: 'MLS_A' }), rawListing({ id: '2', source: 'MLS_A' })]);
const feedB = createStaticFeed('MLS_B', [rawListing({ id: '1', source: 'MLS_B', status: 'sold' })]);
const brokenFeed: ListingFeedAdapter = {
  source: 'MLS_DOWN',
  fetchListings: () => Promise.reject(new Error('timeout')),
};

describe('listing repository', () => {
  it('aggregates and normalizes every feed, keeping colliding ids apart', async () => {
    const { listings, sources } = await aggregateListings([feedA, feedB]);
    expect(listings.map((item) => item.key).sort()).toEqual(['MLS_A:1', 'MLS_A:2', 'MLS_B:1']);
    expect(sources).toEqual(['MLS_A', 'MLS_B']);
  });

  it('returns partial results when a feed fails', async () => {
    const result = await findListings({}, [feedA, brokenFeed]);
    expect(result.meta).toMatchObject({ total: 2, sources: ['MLS_A'], failedSources: ['MLS_DOWN'] });
  });

  it('finds a listing by source and id (case-insensitive source)', async () => {
    expect((await findListing('mls_b', '1', [feedA, feedB]))?.status).toBe('sold');
    expect(await findListing('MLS_A', '404', [feedA, feedB])).toBeUndefined();
  });

  it('serves the bundled sample dataset by default', async () => {
    const result = await findListings({ pageSize: 50 });
    expect(result.meta.total).toBe(12);
    expect(result.meta.sources).toEqual(['MLS_A', 'MLS_B']);
  });
});
