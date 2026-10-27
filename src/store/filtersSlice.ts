import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ListingQuery, ListingStatus, PropertyType, SortOption } from '@/lib/listings/types';

export interface FiltersState {
  q: string;
  location: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  propertyTypes: PropertyType[];
  statuses: ListingStatus[];
  sort: SortOption;
  page: number;
  /**
   * Incremented on every reset so forms can discard un-applied input even when the store
   * already holds the initial filters (react-hook-form ignores unchanged `values`).
   */
  resetCount: number;
}

export type FilterCriteria = Pick<
  FiltersState,
  'minPrice' | 'maxPrice' | 'minBeds' | 'minBaths' | 'propertyTypes' | 'statuses'
>;

export const initialFiltersState: FiltersState = {
  q: '',
  location: '',
  propertyTypes: [],
  statuses: [],
  sort: 'newest',
  page: 1,
  resetCount: 0,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFiltersState,
  reducers: {
    searchSubmitted(state, action: PayloadAction<{ q: string; location: string }>) {
      state.q = action.payload.q.trim();
      state.location = action.payload.location.trim();
      state.page = 1;
    },
    filtersApplied(state, action: PayloadAction<FilterCriteria>) {
      Object.assign(state, action.payload, { page: 1 });
    },
    sortChanged(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
      state.page = 1;
    },
    pageChanged(state, action: PayloadAction<number>) {
      state.page = Math.max(1, Math.trunc(action.payload));
    },
    filtersReset: (state) => ({ ...initialFiltersState, resetCount: state.resetCount + 1 }),
  },
  selectors: {
    selectFilters: (state) => state,
    selectResetCount: (state) => state.resetCount,
    selectListingQuery: createSelector([(state: FiltersState) => state], (state): ListingQuery => ({
      q: state.q || undefined,
      location: state.location || undefined,
      minPrice: state.minPrice,
      maxPrice: state.maxPrice,
      minBeds: state.minBeds,
      minBaths: state.minBaths,
      propertyTypes: state.propertyTypes,
      statuses: state.statuses,
      sort: state.sort,
      page: state.page,
    })),
    selectActiveFilterCount: (state) =>
      [state.minPrice, state.maxPrice, state.minBeds, state.minBaths].filter((value) => value !== undefined).length +
      (state.propertyTypes.length ? 1 : 0) +
      (state.statuses.length ? 1 : 0),
  },
});

export const { searchSubmitted, filtersApplied, sortChanged, pageChanged, filtersReset } = filtersSlice.actions;
export const { selectFilters, selectResetCount, selectListingQuery, selectActiveFilterCount } = filtersSlice.selectors;
export default filtersSlice;
