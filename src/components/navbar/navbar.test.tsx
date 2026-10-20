import { fireEvent, render, screen, within } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

test('renders the Navbar component', () => {
  const { getByText } = render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  // Test that the "KIKA CARVALHO" logo is rendered
  expect(getByText('KIKA CARVALHO')).toBeInTheDocument();
});

test('opens and closes the mobile menu', () => {
  const { container } = render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const menuIcon = screen.getByRole('button', { name: 'menu' });
  const mobileMenu = () => container.querySelector('.navbar__mobile--menu-list');

  // Initially, the mobile menu is closed
  expect(mobileMenu()).not.toBeInTheDocument();

  // Clicking the menu icon opens it with all the links
  fireEvent.click(menuIcon);
  expect(mobileMenu()).toBeInTheDocument();
  ['Sobre', 'Exposições', 'Trabalhos', 'Novidades'].forEach((label) => {
    expect(within(mobileMenu() as HTMLElement).getByText(label)).toBeInTheDocument();
  });

  // Clicking again closes it
  fireEvent.click(menuIcon);
  expect(mobileMenu()).not.toBeInTheDocument();
});
