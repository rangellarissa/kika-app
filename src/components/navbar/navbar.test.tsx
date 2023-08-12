import { fireEvent, render, screen } from '@testing-library/react';

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
  // Set the screen width to simulate mobile view
  global.innerWidth = 767;

  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  const menuIcon = screen.getByRole('button', { name: 'menu' });

  // Initially, mobile menu should not be visible
  expect(screen.queryByText('Exposiçõess')).not.toBeInTheDocument();
  expect(screen.queryByText('Trabalhoss')).not.toBeInTheDocument();
  expect(screen.queryByText('Sobres')).not.toBeInTheDocument();
  expect(screen.queryByText('Novidadess')).not.toBeInTheDocument();

  // Click the menu icon to open the mobile menu
  fireEvent.click(menuIcon);

  // After clicking, mobile menu should be visible
  expect(screen.getByText('Exposições.')).toBeVisible();
  expect(screen.getByText('Trabalhos.')).toBeVisible();
  expect(screen.getByText('Sobre.')).toBeVisible();
  expect(screen.getByText('Novidades.')).toBeVisible();

  // Click the menu icon again to close the mobile menu
  fireEvent.click(menuIcon);

  // After clicking again, mobile menu should not be visible
  expect(screen.queryByText('Exposições.')).not.toBeInTheDocument();
  expect(screen.queryByText('Trabalhos.')).not.toBeInTheDocument();
  expect(screen.queryByText('Sobre.')).not.toBeInTheDocument();
  expect(screen.queryByText('Novidades.')).not.toBeInTheDocument();

  // Reset the screen width
  global.innerWidth = 1024; // Set to a default width
});