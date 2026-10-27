import {
  LISTING_STATUSES,
  PROPERTY_TYPES,
  type Listing,
  type ListingStatus,
  type PropertyType,
  type RawListing,
} from './types';

const US_STATES: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA', colorado: 'CO',
  connecticut: 'CT', delaware: 'DE', 'district of columbia': 'DC', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS', kentucky: 'KY',
  louisiana: 'LA', maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI', minnesota: 'MN',
  mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH',
  'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND',
  ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
};

const STATE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATES).map(([name, code]) => [code, name]),
);

/** "TX" -> "texas" (lowercase), or "" when unknown. */
export const stateName = (code: string) => STATE_NAMES[code.toUpperCase()] ?? '';

export const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

export const toTitleCase = (value: string) =>
  collapseWhitespace(value)
    .toLowerCase()
    .replace(/(^|[\s-])([a-z])/g, (_, sep: string, char: string) => sep + char.toUpperCase());

export const normalizeState = (value: string) => {
  const cleaned = collapseWhitespace(value);
  if (cleaned.length === 2) return cleaned.toUpperCase();
  return US_STATES[cleaned.toLowerCase()] ?? cleaned.toUpperCase();
};

/** "78701-4421" -> "78701"; numeric zips lose leading zeros, so pad them back. */
export const normalizeZip = (value: string | number) => {
  const digits = String(value).trim().split('-')[0].replace(/\D/g, '');
  return digits.padStart(5, '0').slice(0, 5);
};

export const normalizeStatus = (value: string): ListingStatus => {
  const cleaned = value.trim().toLowerCase();
  return (LISTING_STATUSES as readonly string[]).includes(cleaned) ? (cleaned as ListingStatus) : 'active';
};

const PROPERTY_TYPE_RULES: [PropertyType, RegExp][] = [
  ['land', /\b(vacant land|land parcel|lot \d+|acre lot|buildable lot)\b|^lot\b/i],
  ['multi_family', /\b(duplex|triplex|fourplex|multi-?family|\d+-unit building|apartment building)\b/i],
  ['townhouse', /\b(townhome|townhouse|town house|row ?house)\b/i],
  ['single_family', /\b(single[- ]family|detached (home|house))\b/i],
  ['condo', /\b(condo|condominium|apartment)\b/i],
];

// Unit designators only indicate a condo when they appear in the street address ("Unit 4B", "#12").
const ADDRESS_UNIT_PATTERN = /\b(apt|unit|ste|suite)\b|#/i;

/**
 * Feeds do not always provide a property type. Use it when present and valid, otherwise infer it
 * from the description and address, defaulting to single family.
 */
export const inferPropertyType = (raw: Pick<RawListing, 'propertyType' | 'description' | 'address'>): PropertyType => {
  const provided = raw.propertyType?.trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (provided && (PROPERTY_TYPES as readonly string[]).includes(provided)) return provided as PropertyType;

  const description = raw.description ?? '';
  for (const [type, pattern] of PROPERTY_TYPE_RULES) {
    if (pattern.test(description)) return type;
  }
  for (const [type, pattern] of PROPERTY_TYPE_RULES) {
    if (pattern.test(raw.address)) return type;
  }
  return ADDRESS_UNIT_PATTERN.test(raw.address) ? 'condo' : 'single_family';
};

const toNumber = (value: unknown, fallback = 0) => {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const listingKey = (source: string, id: string) => `${source}:${id}`;

export function normalizeListing(raw: RawListing): Listing {
  const id = String(raw.id).trim();
  const source = collapseWhitespace(raw.source).toUpperCase();

  return {
    key: listingKey(source, id),
    id,
    source,
    address: collapseWhitespace(raw.address),
    city: toTitleCase(raw.city),
    state: normalizeState(raw.state),
    zip: normalizeZip(raw.zip),
    price: Math.max(0, toNumber(raw.price)),
    bedrooms: Math.max(0, Math.trunc(toNumber(raw.bedrooms))),
    bathrooms: Math.max(0, toNumber(raw.bathrooms)),
    sqft: Math.max(0, Math.trunc(toNumber(raw.sqft))),
    latitude: toNumber(raw.latitude),
    longitude: toNumber(raw.longitude),
    listedDate: raw.listedDate,
    status: normalizeStatus(raw.status),
    propertyType: inferPropertyType(raw),
    description: collapseWhitespace(raw.description ?? ''),
  };
}
