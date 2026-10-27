import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/listings/format';
import type { Listing } from '@/lib/listings/types';

type FactsListing = Pick<Listing, 'bedrooms' | 'bathrooms' | 'sqft' | 'propertyType'>;

export function ListingFacts({ listing, className }: { listing: FactsListing; className?: string }) {
  const facts =
    listing.propertyType === 'land'
      ? []
      : [
          { value: listing.bedrooms, label: listing.bedrooms === 1 ? 'bd' : 'bds', title: 'Bedrooms' },
          { value: listing.bathrooms, label: 'ba', title: 'Bathrooms' },
          ...(listing.sqft > 0 ? [{ value: formatNumber(listing.sqft), label: 'sqft', title: 'Square feet' }] : []),
        ];

  if (!facts.length) return <p className={cn('text-13 text-text-muted', className)}>Lot / land</p>;

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-13 text-text-secondary', className)}>
      {facts.map((fact) => (
        <li key={fact.title} title={fact.title} className="flex items-baseline gap-1">
          <span className="font-semibold text-text-primary">{fact.value}</span>
          <span>{fact.label}</span>
        </li>
      ))}
    </ul>
  );
}
