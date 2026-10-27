'use client';

import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { searchSubmitted, selectFilters } from '@/store/filtersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface SearchFormValues {
  q: string;
  location: string;
}

export function SearchBar() {
  const dispatch = useAppDispatch();
  const { q, location } = useAppSelector(selectFilters);
  // `values` keeps the form in sync when the store changes elsewhere (e.g. "Clear all").
  const values = useMemo(() => ({ q, location }), [q, location]);
  const { register, handleSubmit } = useForm<SearchFormValues>({ values });

  return (
    <form
      role="search"
      aria-label="Search listings"
      onSubmit={handleSubmit((formValues) => dispatch(searchSubmitted(formValues)))}
      className="flex w-full flex-col gap-2 rounded-lg bg-background-surface p-2 shadow-card-hover md:flex-row md:items-center"
    >
      <label htmlFor="search-q" className="sr-only">
        Keyword
      </label>
      <Input
        id="search-q"
        size="lg"
        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
        placeholder="Keyword, address, or feature (e.g. condo, garage)"
        autoComplete="off"
        maxLength={200}
        className="border-transparent md:flex-[3]"
        {...register('q')}
      />
      <span className="hidden h-8 w-px bg-divider md:block" aria-hidden />
      <label htmlFor="search-location" className="sr-only">
        Location
      </label>
      <Input
        id="search-location"
        size="lg"
        icon={<MapPinIcon className="h-5 w-5" />}
        placeholder="City, state, or ZIP"
        autoComplete="off"
        maxLength={200}
        className="border-transparent md:flex-[2]"
        {...register('location')}
      />
      <Button type="submit" size="lg" className="md:w-auto">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden />
        Search
      </Button>
    </form>
  );
}
