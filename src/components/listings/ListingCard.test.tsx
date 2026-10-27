import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { listing } from '@/test/fixtures';
import { ListingCard } from './ListingCard';

describe('ListingCard', () => {
  it('shows the key listing facts and links to the detail page', () => {
    render(
      <ListingCard
        listing={listing({ id: 'B-1', source: 'MLS_B', address: '1840 Clay St', city: 'san francisco', state: 'ca', zip: '94109', price: 2875000, status: 'pending', sqft: 2800 })}
      />,
    );

    expect(screen.getByText('$2,875,000')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('MLS_B')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA 94109')).toBeInTheDocument();
    expect(screen.getByTitle('Square feet')).toHaveTextContent('2,800');
    expect(screen.getByRole('link', { name: '1840 Clay St' })).toHaveAttribute('href', '/listings/MLS_B/B-1');
  });

  it('hides bed/bath facts for land', () => {
    render(<ListingCard listing={listing({ description: 'Vacant land parcel', bedrooms: 0, bathrooms: 0, sqft: 0 })} />);
    expect(screen.getByText('Lot / land')).toBeInTheDocument();
    expect(screen.queryByTitle('Bedrooms')).not.toBeInTheDocument();
  });
});
