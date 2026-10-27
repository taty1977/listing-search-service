import { describe, expect, it } from 'vitest';
import {
  filtersApplied,
  filtersReset,
  initialFiltersState,
  pageChanged,
  searchSubmitted,
  selectActiveFilterCount,
  selectListingQuery,
  sortChanged,
} from '../filtersSlice';
import { makeStore } from '../store';

describe('filtersSlice', () => {
  it('trims search input and resets paging', () => {
    const store = makeStore();
    store.dispatch(pageChanged(3));
    store.dispatch(searchSubmitted({ q: '  condo ', location: ' Austin ' }));
    expect(store.getState().filters).toMatchObject({ q: 'condo', location: 'Austin', page: 1 });
  });

  it('applies filters, sort and paging', () => {
    const store = makeStore();
    store.dispatch(filtersApplied({ minPrice: 100, maxPrice: 200, minBeds: 2, minBaths: undefined, propertyTypes: ['condo'], statuses: [] }));
    store.dispatch(sortChanged('price_desc'));
    store.dispatch(pageChanged(2));

    expect(selectListingQuery(store.getState())).toEqual({
      q: undefined,
      location: undefined,
      minPrice: 100,
      maxPrice: 200,
      minBeds: 2,
      minBaths: undefined,
      propertyTypes: ['condo'],
      statuses: [],
      sort: 'price_desc',
      page: 2,
    });
    expect(selectActiveFilterCount(store.getState())).toBe(4);
  });

  it('returns a memoized query object while filters are unchanged', () => {
    const store = makeStore();
    expect(selectListingQuery(store.getState())).toBe(selectListingQuery(store.getState()));
  });

  it('resets everything', () => {
    const store = makeStore();
    store.dispatch(searchSubmitted({ q: 'x', location: 'y' }));
    store.dispatch(filtersReset());
    expect(store.getState().filters).toEqual({ ...initialFiltersState, resetCount: 1 });
  });
});
