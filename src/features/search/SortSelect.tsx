'use client';

import { Select } from '@/components/ui';
import { SORT_LABELS, SORT_OPTIONS, type SortOption } from '@/lib/listings/types';
import { selectFilters, sortChanged } from '@/store/filtersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function SortSelect() {
  const dispatch = useAppDispatch();
  const { sort } = useAppSelector(selectFilters);
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="whitespace-nowrap text-13 text-text-muted">
        Sort by
      </label>
      <Select
        id="sort"
        size="sm"
        value={sort}
        onChange={(event) => dispatch(sortChanged(event.target.value as SortOption))}
        className="w-auto min-w-[170px]"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </Select>
    </div>
  );
}
