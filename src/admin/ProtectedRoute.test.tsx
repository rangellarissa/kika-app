import { MemoryRouter, Route, Routes } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import { render, screen } from '@testing-library/react'
import { useAuth } from './AuthContext'

jest.mock('./AuthContext', () => ({ useAuth: jest.fn() }))

const mockStatus = (status: string) => (useAuth as jest.Mock).mockReturnValue({ status })

const renderAt = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/login" element={<p>login page</p>} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<p>admin content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

test('shows a loading state while the session is checked', () => {
  mockStatus('loading')
  renderAt()
  expect(screen.getByText('Carregando...')).toBeInTheDocument()
})

test.each(['signedOut', 'forbidden'])('redirects to /login when %s', (status) => {
  mockStatus(status)
  renderAt()
  expect(screen.getByText('login page')).toBeInTheDocument()
})

test('renders the admin content for admins', () => {
  mockStatus('admin')
  renderAt()
  expect(screen.getByText('admin content')).toBeInTheDocument()
})
