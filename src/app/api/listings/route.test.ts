import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import type { ApiError, Listing, ListingSearchResponse } from '@/lib/listings/types';
import { GET as getListing } from './[source]/[id]/route';
import { GET as searchListings } from './route';

const request = (path: string) => new NextRequest(new URL(path, 'http://localhost'));

describe('GET /api/listings', () => {
  it('returns paginated, normalized listings with metadata', async () => {
    const response = await searchListings(request('/api/listings'));
    const body = (await response.json()) as ListingSearchResponse;

    expect(response.status).toBe(200);
    expect(body.meta).toMatchObject({ total: 12, page: 1, pageSize: 9, totalPages: 2, sources: ['MLS_A', 'MLS_B'] });
    expect(body.data).toHaveLength(9);
  });

  it('applies keyword, location and filter params', async () => {
    const response = await searchListings(request('/api/listings?location=san%20francisco&type=condo&status=active&sort=price_asc'));
    const body = (await response.json()) as ListingSearchResponse;

    expect(body.data.map((item) => item.key)).toEqual(['MLS_B:1001', 'MLS_B:B-2003']);
  });

  it('rejects an inverted price range', async () => {
    const response = await searchListings(request('/api/listings?minPrice=10&maxPrice=1'));
    expect(response.status).toBe(400);
    expect(((await response.json()) as ApiError).error.message).toMatch(/minPrice/);
  });
});

describe('GET /api/listings/:source/:id', () => {
  const ctx = (source: string, id: string) => ({ params: Promise.resolve({ source, id }) });

  it('disambiguates ids shared across sources', async () => {
    const a = (await (await getListing(request('/'), ctx('MLS_A', '1001'))).json()) as Listing;
    const b = (await (await getListing(request('/'), ctx('MLS_B', '1001'))).json()) as Listing;
    expect(a.city).toBe('Austin');
    expect(b.city).toBe('San Francisco');
  });

  it('returns 404 for unknown listings', async () => {
    const response = await getListing(request('/'), ctx('MLS_A', 'missing'));
    expect(response.status).toBe(404);
  });
});
