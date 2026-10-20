import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Login from './Login'
import { useAuth } from '../../admin/AuthContext'

jest.mock('../../admin/AuthContext', () => ({ useAuth: jest.fn() }))

const signIn = jest.fn()
const signOut = jest.fn()

const renderLogin = (status: string) => {
  ;(useAuth as jest.Mock).mockReturnValue({ status, signIn, signOut })
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<p>admin page</p>} />
      </Routes>
    </MemoryRouter>
  )
}

const fillAndSubmit = () => {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } })
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'secret' } })
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
}

beforeEach(() => jest.resetAllMocks())

test('submits the credentials', async () => {
  signIn.mockResolvedValue(null)
  renderLogin('signedOut')

  fillAndSubmit()

  await waitFor(() => expect(signIn).toHaveBeenCalledWith('a@b.com', 'secret'))
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('shows a generic error when sign in fails', async () => {
  signIn.mockResolvedValue('Invalid login credentials')
  renderLogin('signedOut')

  fillAndSubmit()

  expect(await screen.findByRole('alert')).toHaveTextContent('Email ou senha inválidos.')
  expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled()
})

test('redirects admins to /admin', () => {
  renderLogin('admin')
  expect(screen.getByText('admin page')).toBeInTheDocument()
})

test('offers sign out to accounts without access', () => {
  renderLogin('forbidden')

  expect(screen.getByText('Esta conta não tem acesso à área de gestão.')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Sair' }))
  expect(signOut).toHaveBeenCalled()
})
