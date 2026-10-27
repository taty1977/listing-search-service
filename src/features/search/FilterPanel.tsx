'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Field, Input, Select, ToggleChip } from '@/components/ui';
import {
  LISTING_STATUSES,
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  STATUS_LABELS,
} from '@/lib/listings/types';
import { filtersApplied, filtersReset, selectFilters } from '@/store/filtersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toFilterCriteria, toFilterFormValues, type FilterFormValues } from './filterForm';

const BED_OPTIONS = [1, 2, 3, 4, 5];
const BATH_OPTIONS = [1, 1.5, 2, 3, 4];

interface FilterPanelProps {
  /** Called after filters are applied or cleared (e.g. to close the mobile drawer). */
  onDone?: () => void;
}

export function FilterPanel({ onDone }: FilterPanelProps) {
  const dispatch = useAppDispatch();
  const { minPrice, maxPrice, minBeds, minBaths, propertyTypes, statuses } = useAppSelector(selectFilters);
  const values = useMemo(
    () => toFilterFormValues({ minPrice, maxPrice, minBeds, minBaths, propertyTypes, statuses }),
    [minPrice, maxPrice, minBeds, minBaths, propertyTypes, statuses],
  );
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FilterFormValues>({ values, mode: 'onSubmit' });

  const onSubmit = (formValues: FilterFormValues) => {
    dispatch(filtersApplied(toFilterCriteria(formValues)));
    onDone?.();
  };

  const onReset = () => {
    dispatch(filtersReset());
    onDone?.();
  };

  const priceRules = {
    min: { value: 0, message: 'Price cannot be negative.' },
  };

  return (
    <form aria-label="Filter listings" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-15 font-semibold text-text-primary">Price</legend>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Min price" htmlFor="filter-min-price" error={errors.minPrice?.message}>
            <Input
              id="filter-min-price"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              placeholder="No min"
              invalid={Boolean(errors.minPrice)}
              {...register('minPrice', priceRules)}
            />
          </Field>
          <Field label="Max price" htmlFor="filter-max-price" error={errors.maxPrice?.message}>
            <Input
              id="filter-max-price"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              placeholder="No max"
              invalid={Boolean(errors.maxPrice)}
              {...register('maxPrice', {
                ...priceRules,
                validate: (value) => {
                  const min = getValues('minPrice');
                  if (value === '' || min === '') return true;
                  return Number(value) >= Number(min) || 'Max price must be greater than min price.';
                },
              })}
            />
          </Field>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Bedrooms" htmlFor="filter-beds">
          <Select id="filter-beds" {...register('minBeds')}>
            <option value="">Any</option>
            {BED_OPTIONS.map((beds) => (
              <option key={beds} value={beds}>
                {beds}+
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Bathrooms" htmlFor="filter-baths">
          <Select id="filter-baths" {...register('minBaths')}>
            <option value="">Any</option>
            {BATH_OPTIONS.map((baths) => (
              <option key={baths} value={baths}>
                {baths}+
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <fieldset>
        <legend className="mb-3 text-15 font-semibold text-text-primary">Property type</legend>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <ToggleChip key={type} value={type} label={PROPERTY_TYPE_LABELS[type]} {...register('propertyTypes')} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-15 font-semibold text-text-primary">Listing status</legend>
        <div className="flex flex-wrap gap-2">
          {LISTING_STATUSES.map((status) => (
            <ToggleChip key={status} value={status} label={STATUS_LABELS[status]} {...register('statuses')} />
          ))}
        </div>
      </fieldset>

      <div className="flex gap-3 border-t border-divider pt-4">
        <Button type="button" variant="ghost" onClick={onReset} className="flex-1">
          Clear all
        </Button>
        <Button type="submit" className="flex-1">
          Apply filters
        </Button>
      </div>
    </form>
  );
}
