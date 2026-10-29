import { describe, expect, it } from 'vitest';
import { rawListing } from '@/test/fixtures';
import { aggregateListings, findListing, findListings } from '../repository';
import { createStaticFeed } from '../staticFeed';
import type { ListingFeedAdapter } from '../types';

const feedA = createStaticFeed('MLS_A', [
  rawListing({ id: '1', source: 'MLS_A' }),
  rawListing({ id: '2', source: 'MLS_A', address: '2 Main St' }),
]);
const feedB = createStaticFeed('MLS_B', [rawListing({ id: '1', source: 'MLS_B', address: '3 Main St', status: 'sold' })]);
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

  it('merges normalized addresses across feeds and keeps the newest full record', async () => {
    const older = createStaticFeed('MLS_A', [rawListing({ listedDate: '2026-01-01', price: 600000 })]);
    const newer = createStaticFeed('MLS_B', [rawListing({
      source: 'MLS_B', id: 'new', address: '  1   MAIN st ', city: ' AUSTIN ',
      state: 'Texas', zip: '78701-1234', listedDate: '2026-02-01', price: 450000,
    })]);
    for (const feeds of [[older, newer], [newer, older]]) {
      const result = await findListings({}, feeds);
      expect(result.meta.total).toBe(1);
      expect(result.meta.sources).toEqual(feeds.map((feed) => feed.source));
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({ key: 'MLS_B:new', price: 450000 });
    }
    expect(await findListing('MLS_A', '1', [older, newer])).toMatchObject({ key: 'MLS_A:1' });
  });

  it('keeps the first property on equal dates within and across feeds', async () => {
    const first = createStaticFeed('MLS_A', [
      rawListing({ id: 'first' }), rawListing({ id: 'second' }),
    ]);
    const second = createStaticFeed('MLS_B', [rawListing({ source: 'MLS_B', id: 'third' })]);
    expect((await findListings({}, [first, second])).data.map((item) => item.key)).toEqual(['MLS_A:first']);
    expect((await findListings({}, [second, first])).data.map((item) => item.key)).toEqual(['MLS_B:third']);
  });

  it('keeps different units, cities, states, and ZIPs separate', async () => {
    const records = [
      rawListing({ id: 'base' }),
      rawListing({ id: 'unit1', address: '1 Main St Unit 1' }),
      rawListing({ id: 'unit2', address: '1 Main St Unit 2' }),
      rawListing({ id: 'city', city: 'Round Rock' }),
      rawListing({ id: 'state', state: 'CA' }),
      rawListing({ id: 'zip', zip: '78702' }),
    ];
    const result = await findListings({}, [createStaticFeed('MLS_A', records)]);
    expect(result.meta.total).toBe(6);
    expect(result.data).toHaveLength(6);
  });

  it('deduplicates before filters, sorting, counts, and pagination', async () => {
    const feed = createStaticFeed('MLS_A', [
      rawListing({ id: 'old', listedDate: '2026-01-01', price: 100 }),
      rawListing({ id: 'new', listedDate: '2026-02-01', price: 300 }),
      rawListing({ id: 'other', address: '2 Main St', price: 200 }),
    ]);
    const page = await findListings({ pageSize: 1, page: 2, sort: 'price_asc' }, [feed]);
    expect(page.meta).toMatchObject({ total: 2, totalPages: 2, page: 2 });
    expect(page.data.map((item) => item.id)).toEqual(['new']);
    const filtered = await findListings({ maxPrice: 150 }, [feed]);
    expect(filtered.meta.total).toBe(0);
    expect(filtered.data).toEqual([]);
  });

  it('prefers valid dates and retains the first when both dates are invalid', async () => {
    const feed = createStaticFeed('MLS_A', [
      rawListing({ id: 'invalid', listedDate: 'invalid' }),
      rawListing({ id: 'valid', listedDate: '2026-01-01' }),
      rawListing({ id: 'invalid-again', listedDate: '' }),
      rawListing({ id: 'other-first', address: '2 Main St', listedDate: 'invalid' }),
      rawListing({ id: 'other-second', address: '2 Main St', listedDate: '' }),
    ]);
    const result = await findListings({}, [feed]);
    expect(result.data.map((item) => item.id).sort()).toEqual(['other-first', 'valid']);
  });
});
