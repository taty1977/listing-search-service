import { normalizeListing } from '@/lib/listings/normalize';
import type { Listing, RawListing } from '@/lib/listings/types';

export const rawListing = (overrides: Partial<RawListing> = {}): RawListing => ({
  id: '1',
  source: 'MLS_A',
  address: '1 Main St',
  city: 'Austin',
  state: 'TX',
  zip: '78701',
  price: 500000,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1500,
  latitude: 30.27,
  longitude: -97.74,
  listedDate: '2026-01-01',
  status: 'active',
  description: 'Bright single-family home.',
  ...overrides,
});

export const listing = (overrides: Partial<RawListing> = {}): Listing => normalizeListing(rawListing(overrides));
