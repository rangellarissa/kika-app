import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import AdminLayout from './AdminLayout'
import { useAuth } from './AuthContext'

jest.mock('./AuthContext', () => ({ useAuth: jest.fn() }))

const signOut = jest.fn()

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/admin/novidades']}>
      <Routes>
        <Route path="/login" element={<p>login page</p>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="novidades" element={<p>novidades content</p>} />
          <Route path="sobre" element={<p>sobre content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  jest.resetAllMocks()
  ;(useAuth as jest.Mock).mockReturnValue({ signOut })
})

test('shows the header, the tabs and the current page', () => {
  renderLayout()

  expect(screen.getByRole('heading', { name: 'Gestão de Conteúdo' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'novidades' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'projetos especiais' })).toBeInTheDocument()
  expect(screen.getByText('novidades content')).toBeInTheDocument()
})

test('the menu button toggles the tabs and picking a tab closes it', () => {
  renderLayout()
  const menu = screen.getByRole('button', { name: 'Menu' })
  const tabs = document.getElementById('admin-tabs') as HTMLElement

  expect(menu).toHaveAttribute('aria-expanded', 'false')
  expect(tabs).not.toHaveClass('admin__tabs--open')

  fireEvent.click(menu)
  expect(menu).toHaveAttribute('aria-expanded', 'true')
  expect(tabs).toHaveClass('admin__tabs--open')

  fireEvent.click(screen.getByRole('link', { name: 'sobre' }))
  expect(screen.getByText('sobre content')).toBeInTheDocument()
  expect(menu).toHaveAttribute('aria-expanded', 'false')
})

test('signing out goes back to the login page', async () => {
  signOut.mockResolvedValue(undefined)
  renderLayout()

  fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

  expect(await screen.findByText('login page')).toBeInTheDocument()
  expect(signOut).toHaveBeenCalled()
})
