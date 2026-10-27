import type { FilterCriteria } from '@/store/filtersSlice';
import type { ListingStatus, PropertyType } from '@/lib/listings/types';

/** Raw form state: inputs/selects produce strings, checkbox groups produce arrays. */
export interface FilterFormValues {
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  minBaths: string;
  propertyTypes: PropertyType[];
  statuses: ListingStatus[];
}

const toOptionalNumber = (value: string) => {
  // An empty field means no filter, not the zero that Number('') would produce.
  if (value.trim() === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const toText = (value: number | undefined) => (value === undefined ? '' : String(value));

export const toFilterFormValues = (criteria: FilterCriteria): FilterFormValues => ({
  minPrice: toText(criteria.minPrice),
  maxPrice: toText(criteria.maxPrice),
  minBeds: toText(criteria.minBeds),
  minBaths: toText(criteria.minBaths),
  propertyTypes: criteria.propertyTypes,
  statuses: criteria.statuses,
});

export const toFilterCriteria = (values: FilterFormValues): FilterCriteria => ({
  minPrice: toOptionalNumber(values.minPrice),
  maxPrice: toOptionalNumber(values.maxPrice),
  minBeds: toOptionalNumber(values.minBeds),
  minBaths: toOptionalNumber(values.minBaths),
  // A single checked checkbox can surface as a string depending on how the group is registered.
  propertyTypes: ([] as PropertyType[]).concat(values.propertyTypes || []),
  statuses: ([] as ListingStatus[]).concat(values.statuses || []),
});
