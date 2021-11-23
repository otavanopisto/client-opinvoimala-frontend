import React from 'react';
import { render, waitForApi } from '../../utils/test-utils';
import { FrontPage } from '../FrontPage';
import { MemoryRouter } from 'react-router';

const Component = (
  <MemoryRouter initialEntries={['/']}>
    <FrontPage />
  </MemoryRouter>
);

describe('VIEW: <FrontPage />', () => {
  it('renders main title', async () => {
    const { getByTestId } = render(Component);
    await waitForApi();

    const element = getByTestId('hero__title');
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('Mock title for the front page!');
  });

  it('renders lead text', async () => {
    const { findByText } = render(Component);
    await waitForApi();

    const element = await findByText(/Mock lead text for the front page!/i);
    expect(element).toBeInTheDocument();
  });

  it('renders some cards', async () => {
    const screen = render(Component);
    expect(await screen.findByText(/Mock card 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Mock card 2/i)).toBeInTheDocument();
  });
});
