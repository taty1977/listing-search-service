import type { Listing } from './types';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});
const integer = new Intl.NumberFormat('en-US');
// Date-only feed values must not shift to the previous day in western time zones.
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const formatPrice = (value: number) => currency.format(value);
export const formatCompactPrice = (value: number) => compactCurrency.format(value);
export const formatNumber = (value: number) => integer.format(value);
export const formatListedDate = (iso: string) => {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? iso : date.format(parsed);
};
export const formatCityLine = (listing: Pick<Listing, 'city' | 'state' | 'zip'>) =>
  `${listing.city}, ${listing.state} ${listing.zip}`;
export const pricePerSqft = (listing: Pick<Listing, 'price' | 'sqft'>) =>
  listing.sqft > 0 ? Math.round(listing.price / listing.sqft) : undefined;
