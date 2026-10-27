'use client';

import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Badge, Button, Card } from '@/components/ui';
import { selectActiveFilterCount } from '@/store/filtersSlice';
import { useAppSelector } from '@/store/hooks';
import { FilterPanel } from './FilterPanel';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';

export function SearchPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters = useAppSelector(selectActiveFilterCount);

  return (
    <>
      <section className="bg-background-inverse">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <h1 className="text-28 font-bold leading-38 text-text-inverse md:text-38 md:leading-42">
            Find your next property
          </h1>
          <p className="max-w-2xl text-15 text-secondary-200">
            Search listings aggregated from multiple MLS feeds by keyword or location, then narrow down by price, type,
            size, and status.
          </p>
          <SearchBar />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <div className="lg:hidden">
          <Button
            variant="outline"
            fullWidth
            aria-expanded={filtersOpen}
            aria-controls="filters-panel"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {filtersOpen ? (
              <XMarkIcon className="h-5 w-5" aria-hidden />
            ) : (
              <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden />
            )}
            {filtersOpen ? 'Hide filters' : 'Filters'}
            {activeFilters > 0 ? <Badge tone="primary">{activeFilters}</Badge> : null}
          </Button>
        </div>

        <aside
          id="filters-panel"
          aria-label="Filters"
          className={filtersOpen ? 'block' : 'hidden lg:block'}
        >
          <Card padding="lg" className="lg:sticky lg:top-6">
            <FilterPanel onDone={() => setFiltersOpen(false)} />
          </Card>
        </aside>

        <SearchResults />
      </div>
    </>
  );
}
