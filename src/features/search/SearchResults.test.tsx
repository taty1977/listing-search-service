import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ListingSearchResponse } from '@/lib/listings/types';
import { listing } from '@/test/fixtures';
import { renderWithStore } from '@/test/render';
import { SearchResults } from './SearchResults';

const page = (overrides: Partial<ListingSearchResponse['meta']> = {}, data = [listing()]): ListingSearchResponse => ({
  data,
  meta: { total: data.length, page: 1, pageSize: 9, totalPages: 1, sources: ['MLS_A'], failedSources: [], ...overrides },
});

const mockFetch = (...responses: Response[]) => {
  const fetchMock = vi.fn();
  responses.forEach((response) => fetchMock.mockResolvedValueOnce(response));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('SearchResults', () => {
  it('shows a loading skeleton, then the results', async () => {
    const fetchMock = mockFetch(Response.json(page()));
    renderWithStore(<SearchResults />);

    expect(screen.getByRole('status', { name: 'Loading listings' })).toBeInTheDocument();
    expect(await screen.findByText('1 property found')).toBeInTheDocument();
    expect(screen.getAllByTestId('listing-card')).toHaveLength(1);
    expect((fetchMock.mock.calls[0][0] as Request).url).toBe('http://localhost/api/listings?sort=newest&page=1');
  });

  it('shows the empty state and lets the user clear filters', async () => {
    mockFetch(Response.json(page({ total: 0 }, [])), Response.json(page()));
    const user = userEvent.setup();
    const { store } = renderWithStore(<SearchResults />, {
      filters: { q: 'castle', location: '', propertyTypes: [], statuses: [], sort: 'newest', page: 1, resetCount: 0 },
    });

    expect(await screen.findByText('No properties match your search')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear search and filters' }));
    expect(store.getState().filters.q).toBe('');
  });

  it('shows the error state and retries', async () => {
    const fetchMock = mockFetch(
      Response.json({ error: { status: 500, message: 'Feed timeout.' } }, { status: 500 }),
      Response.json(page()),
    );
    const user = userEvent.setup();
    renderWithStore(<SearchResults />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Feed timeout.');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('1 property found')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('warns when some feeds are unavailable and paginates', async () => {
    mockFetch(Response.json(page({ total: 10, totalPages: 2, failedSources: ['MLS_B'] })));
    const user = userEvent.setup();
    const { store } = renderWithStore(<SearchResults />);

    expect(await screen.findByText(/Some feeds are unavailable \(MLS_B\)/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Next/ }));
    expect(store.getState().filters.page).toBe(2);
  });
});
