import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { listing } from '@/test/fixtures';
import { renderWithStore } from '@/test/render';
import { ListingDetailView } from '../ListingDetailView';

vi.mock('next/navigation', () => ({
  useParams: () => ({ source: 'MLS_A', id: '1001' }),
}));

const mockFetch = (...responses: Response[]) => {
  const fetchMock = vi.fn();
  responses.forEach((response) => fetchMock.mockResolvedValueOnce(response));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

describe('ListingDetailView', () => {
  it('shows loading, then the requested listing and navigation', async () => {
    const detail = listing({ id: '1001', source: 'MLS_A', address: '742 Evergreen Terrace' });
    const fetchMock = mockFetch(Response.json(detail));
    renderWithStore(<ListingDetailView />);

    expect(screen.getByRole('status', { name: 'Loading listing' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1, name: detail.address })).toBeInTheDocument();
    expect(screen.getByText('Property facts')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to search' })).toHaveAttribute('href', '/');
    expect((fetchMock.mock.calls[0][0] as Request).url).toBe('http://localhost/api/listings/MLS_A/1001');
  });

  it('shows a dedicated not-found state for a 404', async () => {
    mockFetch(Response.json({ error: { message: 'Not found' } }, { status: 404 }));
    renderWithStore(<ListingDetailView />);

    expect(await screen.findByText('Listing not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse listings' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
  });

  it('shows server errors and retries successfully', async () => {
    const fetchMock = mockFetch(
      Response.json({ error: { message: 'Feed unavailable' } }, { status: 500 }),
      Response.json(listing()),
    );
    const user = userEvent.setup();
    renderWithStore(<ListingDetailView />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load this listing');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(listing().address);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('shows a recoverable error when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    renderWithStore(<ListingDetailView />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Please check your connection and try again.');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
