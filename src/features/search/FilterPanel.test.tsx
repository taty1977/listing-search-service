import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithStore } from '@/test/render';
import { FilterPanel } from './FilterPanel';

describe('FilterPanel', () => {
  it('applies the selected filters to the store', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn();
    const { store } = renderWithStore(<FilterPanel onDone={onDone} />);

    await user.type(screen.getByLabelText('Min price'), '200000');
    await user.type(screen.getByLabelText('Max price'), '900000');
    await user.selectOptions(screen.getByLabelText('Bedrooms'), '3');
    await user.selectOptions(screen.getByLabelText('Bathrooms'), '1.5');
    await user.click(screen.getByLabelText('Condo'));
    await user.click(screen.getByLabelText('Townhouse'));
    await user.click(screen.getByLabelText('Active'));
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(store.getState().filters).toMatchObject({
      minPrice: 200000,
      maxPrice: 900000,
      minBeds: 3,
      minBaths: 1.5,
      propertyTypes: ['condo', 'townhouse'],
      statuses: ['active'],
      page: 1,
    });
    expect(onDone).toHaveBeenCalled();
  });

  it('validates that max price is not below min price', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<FilterPanel />);

    await user.type(screen.getByLabelText('Min price'), '500000');
    await user.type(screen.getByLabelText('Max price'), '100000');
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Max price must be greater than min price.');
    expect(store.getState().filters.minPrice).toBeUndefined();
  });

  it('clears all filters and syncs the form with the store', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<FilterPanel />, {
      filters: { q: '', location: '', minPrice: 1000, propertyTypes: ['land'], statuses: ['sold'], sort: 'newest', page: 3 },
    });

    expect(screen.getByLabelText('Min price')).toHaveValue(1000);
    expect(screen.getByLabelText('Land')).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(store.getState().filters.propertyTypes).toEqual([]);
    expect(screen.getByLabelText('Min price')).toHaveValue(null);
    expect(screen.getByLabelText('Land')).not.toBeChecked();
  });
});
