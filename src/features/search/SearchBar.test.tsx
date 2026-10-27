import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithStore } from '@/test/render';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('submits keyword and location', async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<SearchBar />);

    await user.type(screen.getByLabelText('Keyword'), 'garage');
    await user.type(screen.getByLabelText('Location'), 'Austin, TX{Enter}');

    expect(store.getState().filters).toMatchObject({ q: 'garage', location: 'Austin, TX' });
  });
});
