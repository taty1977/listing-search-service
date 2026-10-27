import { describe, expect, it } from 'vitest';
import { listing } from '@/test/fixtures';
import { distanceInMiles, matchesQuery, parseListingQuery, searchListings, toSearchParams } from './query';
import type { ListingQuery } from './types';

const austinCondo = listing({
  id: 'a',
  address: '88 Rainey St Unit 1204',
  description: 'High-rise condo with lake views',
  price: 529000,
  bedrooms: 2,
  bathrooms: 2,
  listedDate: '2026-10-02',
});
const austinHouse = listing({ id: 'b', price: 685000, bedrooms: 4, bathrooms: 2.5, sqft: 2450, listedDate: '2026-09-14' });
const sfSold = listing({
  id: 'c',
  source: 'MLS_B',
  city: 'San Francisco',
  state: 'CA',
  zip: '94110',
  price: 1095000,
  status: 'sold',
  latitude: 37.7614,
  longitude: -122.4194,
  listedDate: '2026-09-28',
});
const all = [austinCondo, austinHouse, sfSold];

const keys = (query: ListingQuery) => all.filter((item) => matchesQuery(item, query)).map((item) => item.id);

describe('matchesQuery', () => {
  it('matches keywords against any word prefix, case-insensitively', () => {
    expect(keys({ q: 'LAKE view' })).toEqual(['a']);
    expect(keys({ q: 'rain' })).toEqual(['a']);
    expect(keys({ q: 'castle' })).toEqual([]);
  });

  it('matches location by city, state code, state name or ZIP', () => {
    expect(keys({ location: 'san fran' })).toEqual(['c']);
    expect(keys({ location: 'Austin, TX' })).toEqual(['a', 'b']);
    expect(keys({ location: 'texas' })).toEqual(['a', 'b']);
    expect(keys({ location: '941' })).toEqual(['c']);
  });

  it('does not match a state code inside another word', () => {
    expect(keys({ location: 'ca' })).toEqual(['c']);
  });

  it('filters by price range, beds, baths, type and status', () => {
    expect(keys({ minPrice: 600000 })).toEqual(['b', 'c']);
    expect(keys({ maxPrice: 600000 })).toEqual(['a']);
    expect(keys({ minBeds: 3 })).toEqual(['b', 'c']);
    expect(keys({ minBaths: 2.5 })).toEqual(['b']);
    expect(keys({ propertyTypes: ['condo'] })).toEqual(['a']);
    expect(keys({ statuses: ['active', 'pending'] })).toEqual(['a', 'b']);
    expect(keys({ sources: ['MLS_B'] })).toEqual(['c']);
  });

  it('filters by distance from a point', () => {
    expect(keys({ lat: 37.7749, lng: -122.4194, radiusMiles: 5 })).toEqual(['c']);
  });
});

describe('searchListings', () => {
  it('sorts newest first by default', () => {
    expect(searchListings(all, {}).data.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });

  it('supports price and size sorting', () => {
    expect(searchListings(all, { sort: 'price_desc' }).data.map((item) => item.id)).toEqual(['c', 'b', 'a']);
    expect(searchListings(all, { sort: 'price_asc' }).data.map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(searchListings(all, { sort: 'sqft_desc' }).data[0].id).toBe('b');
  });

  it('paginates and clamps out-of-range pages', () => {
    const page2 = searchListings(all, { pageSize: 2, page: 2 });
    expect(page2).toMatchObject({ total: 3, page: 2, pageSize: 2, totalPages: 2 });
    expect(page2.data).toHaveLength(1);
    expect(searchListings(all, { pageSize: 2, page: 99 }).page).toBe(2);
  });
});

describe('query string serialization', () => {
  it('round-trips a query', () => {
    const query: ListingQuery = {
      q: 'garage',
      location: 'Austin',
      minPrice: 100000,
      maxPrice: 900000,
      minBeds: 2,
      minBaths: 1.5,
      propertyTypes: ['condo', 'townhouse'],
      statuses: ['active'],
      sort: 'price_asc',
      page: 2,
    };
    expect(parseListingQuery(toSearchParams(query))).toEqual(query);
  });

  it('drops invalid values', () => {
    const params = new URLSearchParams('minPrice=-5&maxPrice=abc&type=castle,condo&status=gone&sort=random&page=1.7');
    expect(parseListingQuery(params)).toEqual({ propertyTypes: ['condo'], page: 1 });
  });

  it('omits empty values when serializing', () => {
    expect(toSearchParams({ q: '  ', propertyTypes: [] }).toString()).toBe('');
  });
});

describe('distanceInMiles', () => {
  it('computes great-circle distance', () => {
    // Austin -> San Francisco is roughly 1,500 miles.
    expect(distanceInMiles(30.2672, -97.7431, 37.7749, -122.4194)).toBeCloseTo(1500, -2);
  });
});
