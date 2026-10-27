import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { filtersReset } from '@/store/filtersSlice';
import { renderWithStore } from '@/test/render';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('submits keyword and location', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<SearchBar />);

    await user.type(screen.getByLabelText('Keyword'), 'garage');
    await user.type(screen.getByLabelText('Location'), 'Austin, TX{Enter}');

    expect(store.getState().filters).toMatchObject({ q: 'garage', location: 'Austin, TX' });
  });

  it('clears un-submitted input when filters are reset', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<SearchBar />);

    await user.type(screen.getByLabelText('Keyword'), 'pool');
    act(() => {
      store.dispatch(filtersReset());
    });

    expect(screen.getByLabelText('Keyword')).toHaveValue('');
  });
});
