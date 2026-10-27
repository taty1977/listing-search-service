export const LISTING_STATUSES = ['active', 'pending', 'sold'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const PROPERTY_TYPES = [
  'single_family',
  'condo',
  'townhouse',
  'multi_family',
  'land',
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  single_family: 'Single Family',
  condo: 'Condo',
  townhouse: 'Townhouse',
  multi_family: 'Multi-Family',
  land: 'Land',
};

export const STATUS_LABELS: Record<ListingStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  sold: 'Sold',
};

/** A listing exactly as delivered by an MLS feed (see `src/data/sample_listings.json`). */
export interface RawListing {
  id: string | number;
  source: string;
  address: string;
  city: string;
  state: string;
  zip: string | number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  latitude: number;
  longitude: number;
  listedDate: string;
  status: string;
  description?: string;
  /** Optional: not every feed provides it, so it is inferred when absent. */
  propertyType?: string;
}

/** A normalized listing served by the API and rendered by the UI. */
export interface Listing {
  /** Globally unique key: `id` is only unique per source. */
  key: string;
  id: string;
  source: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  latitude: number;
  longitude: number;
  listedDate: string;
  status: ListingStatus;
  propertyType: PropertyType;
  description: string;
}

export const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc', 'sqft_desc'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  sqft_desc: 'Largest',
};

export interface ListingQuery {
  /** Free-text keyword matched against address, city, description, etc. */
  q?: string;
  /** City, state or ZIP text. */
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  propertyTypes?: PropertyType[];
  statuses?: ListingStatus[];
  sources?: string[];
  /** Geo search: center point + radius in miles. */
  lat?: number;
  lng?: number;
  radiusMiles?: number;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ListingSearchMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** Feeds that contributed to this result. */
  sources: string[];
  /** Feeds that failed to respond (results are partial). */
  failedSources: string[];
}

export interface ListingSearchResponse {
  data: Listing[];
  meta: ListingSearchMeta;
}

export interface ApiError {
  error: { status: number; message: string };
}
