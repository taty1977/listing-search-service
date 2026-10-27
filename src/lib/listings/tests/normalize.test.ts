import { describe, expect, it } from 'vitest';
import { rawListing } from '@/test/fixtures';
import { inferPropertyType, normalizeListing, normalizeState, normalizeStatus, normalizeZip, toTitleCase } from '../normalize';

describe('normalizeListing', () => {
  it('cleans up inconsistencies between feeds', () => {
    const listing = normalizeListing(
      rawListing({
        id: 42,
        source: ' mls_b ',
        address: '  88 Rainey St   Unit 1204 ',
        city: 'san francisco ',
        state: 'California',
        zip: '94105-1234',
        status: 'Pending',
      }),
    );

    expect(listing).toMatchObject({
      key: 'MLS_B:42',
      id: '42',
      source: 'MLS_B',
      address: '88 Rainey St Unit 1204',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      status: 'pending',
    });
  });

  it('builds keys that stay unique when ids collide across sources', () => {
    const a = normalizeListing(rawListing({ id: '1001', source: 'MLS_A' }));
    const b = normalizeListing(rawListing({ id: '1001', source: 'MLS_B' }));
    expect(a.key).not.toBe(b.key);
  });

  it('guards against invalid numbers', () => {
    const listing = normalizeListing(rawListing({ price: Number.NaN, bedrooms: 2.7, sqft: -5 }));
    expect(listing.price).toBe(0);
    expect(listing.bedrooms).toBe(2);
    expect(listing.sqft).toBe(0);
  });
});

describe('field normalizers', () => {
  it.each([
    ['tx', 'TX'],
    ['Texas', 'TX'],
    [' new york ', 'NY'],
  ])('normalizes state %s -> %s', (input, expected) => expect(normalizeState(input)).toBe(expected));

  it('pads numeric zips and strips ZIP+4', () => {
    expect(normalizeZip(2134)).toBe('02134');
    expect(normalizeZip('78701-4421')).toBe('78701');
  });

  it('title-cases cities', () => expect(toTitleCase('  round   rock ')).toBe('Round Rock'));

  it('falls back to active for unknown statuses', () => {
    expect(normalizeStatus('SOLD')).toBe('sold');
    expect(normalizeStatus('coming soon')).toBe('active');
  });
});

describe('inferPropertyType', () => {
  it('prefers the type provided by the feed', () => {
    expect(inferPropertyType({ propertyType: 'Multi Family', description: 'condo', address: '1 Main' })).toBe('multi_family');
  });

  it.each([
    ['High-rise condo with views', 'condo'],
    ['Modern townhome with roof deck', 'townhouse'],
    ['Fourplex investment, four units', 'multi_family'],
    ['Two-acre vacant land parcel', 'land'],
    ['Updated single-family home', 'single_family'],
    ['Single-family home on a flat, usable lot', 'single_family'],
    ['Ranch home in the #1 rated school district', 'single_family'],
    ['Single-family home with a detached in-law unit', 'single_family'],
  ])('infers "%s" as %s', (description, expected) => {
    expect(inferPropertyType({ description, address: '1 Main St' })).toBe(expected);
  });

  it('uses the address when the description is not conclusive', () => {
    expect(inferPropertyType({ description: 'Great location', address: '10 Pine St #4' })).toBe('condo');
    expect(inferPropertyType({ description: 'Great location', address: '22 Oak Ave Unit 3B' })).toBe('condo');
  });
});
