import { stateName } from './normalize';
import {
  LISTING_STATUSES,
  PROPERTY_TYPES,
  SORT_OPTIONS,
  type Listing,
  type ListingQuery,
  type ListingStatus,
  type PropertyType,
  type SortOption,
} from './types';

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

const EARTH_RADIUS_MILES = 3958.8;

/** Great-circle distance between two coordinates, in miles. */
export function distanceInMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9#]+/g, ' ')
    .trim();

const tokenize = (value: string) => normalizeText(value).split(' ').filter(Boolean);

const keywordHaystack = (listing: Listing) =>
  normalizeText(
    [
      listing.address,
      listing.city,
      listing.state,
      stateName(listing.state),
      listing.zip,
      listing.description,
      listing.propertyType.replace('_', ' '),
    ].join(' '),
  );

const locationHaystack = (listing: Listing) => normalizeText([listing.city, listing.state, stateName(listing.state), listing.zip].join(' '));

/** Every token of the needle must prefix a word of the haystack (order-insensitive). */
const matchesAllTokens = (haystack: string, needle: string) => {
  const words = haystack.split(' ');
  return tokenize(needle).every((token) => words.some((word) => word.startsWith(token)));
};

export function matchesQuery(listing: Listing, query: ListingQuery): boolean {
  if (query.q && !matchesAllTokens(keywordHaystack(listing), query.q)) return false;
  if (query.location && !matchesAllTokens(locationHaystack(listing), query.location)) return false;
  if (query.minPrice !== undefined && listing.price < query.minPrice) return false;
  if (query.maxPrice !== undefined && listing.price > query.maxPrice) return false;
  if (query.minBeds !== undefined && listing.bedrooms < query.minBeds) return false;
  if (query.minBaths !== undefined && listing.bathrooms < query.minBaths) return false;
  if (query.propertyTypes?.length && !query.propertyTypes.includes(listing.propertyType)) return false;
  if (query.statuses?.length && !query.statuses.includes(listing.status)) return false;
  if (query.sources?.length && !query.sources.includes(listing.source)) return false;
  if (query.lat !== undefined && query.lng !== undefined && query.radiusMiles !== undefined) {
    if (distanceInMiles(query.lat, query.lng, listing.latitude, listing.longitude) > query.radiusMiles) return false;
  }
  return true;
}

const comparators: Record<SortOption, (a: Listing, b: Listing) => number> = {
  newest: (a, b) => b.listedDate.localeCompare(a.listedDate),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  sqft_desc: (a, b) => b.sqft - a.sqft,
};

export function searchListings(listings: Listing[], query: ListingQuery) {
  const pageSize = Math.min(Math.max(query.pageSize ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
  const comparator = comparators[query.sort ?? 'newest'];
  const matches = listings
    .filter((listing) => matchesQuery(listing, query))
    // Stable tie-breaker so pagination is deterministic.
    .sort((a, b) => comparator(a, b) || a.key.localeCompare(b.key));

  const total = matches.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(query.page ?? 1, 1), totalPages);
  const start = (page - 1) * pageSize;

  return { data: matches.slice(start, start + pageSize), total, page, pageSize, totalPages };
}

/* ---------- URL <-> query serialization (shared by the API and the client) ---------- */

const parseNumber = (value: string | null) => {
  if (value === null || value.trim() === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const parseNonNegative = (value: string | null) => {
  const number = parseNumber(value);
  return number !== undefined && number >= 0 ? number : undefined;
};

const parseList = <T extends string>(value: string | null, allowed?: readonly T[]) => {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean) as T[];
  const valid = allowed ? items.filter((item) => allowed.includes(item)) : items;
  return valid.length ? valid : undefined;
};

const parseText = (value: string | null) => {
  const text = value?.trim();
  return text ? text.slice(0, 200) : undefined;
};

export function parseListingQuery(params: URLSearchParams): ListingQuery {
  const sort = params.get('sort');
  const query: ListingQuery = {
    q: parseText(params.get('q')),
    location: parseText(params.get('location')),
    minPrice: parseNonNegative(params.get('minPrice')),
    maxPrice: parseNonNegative(params.get('maxPrice')),
    minBeds: parseNonNegative(params.get('minBeds')),
    minBaths: parseNonNegative(params.get('minBaths')),
    propertyTypes: parseList<PropertyType>(params.get('type'), PROPERTY_TYPES),
    statuses: parseList<ListingStatus>(params.get('status'), LISTING_STATUSES),
    sources: parseList(params.get('source'))?.map((source) => source.toUpperCase()),
    lat: parseNumber(params.get('lat')),
    lng: parseNumber(params.get('lng')),
    radiusMiles: parseNonNegative(params.get('radius')),
    sort: (SORT_OPTIONS as readonly string[]).includes(sort ?? '') ? (sort as SortOption) : undefined,
    page: parseNonNegative(params.get('page')),
    pageSize: parseNonNegative(params.get('pageSize')),
  };
  if (query.page !== undefined) query.page = Math.trunc(query.page);
  if (query.pageSize !== undefined) query.pageSize = Math.trunc(query.pageSize);

  return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined)) as ListingQuery;
}

export function toSearchParams(query: ListingQuery): URLSearchParams {
  const params = new URLSearchParams();
  const set = (key: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  };
  const setList = (key: string, values: string[] | undefined) => {
    if (values?.length) params.set(key, values.join(','));
  };

  set('q', query.q?.trim());
  set('location', query.location?.trim());
  set('minPrice', query.minPrice);
  set('maxPrice', query.maxPrice);
  set('minBeds', query.minBeds);
  set('minBaths', query.minBaths);
  setList('type', query.propertyTypes);
  setList('status', query.statuses);
  setList('source', query.sources);
  set('lat', query.lat);
  set('lng', query.lng);
  set('radius', query.radiusMiles);
  set('sort', query.sort);
  set('page', query.page);
  set('pageSize', query.pageSize);
  return params;
}
