import { AuthProvider, useAuth } from './AuthContext'
import { act, render, screen, waitFor } from '@testing-library/react'

import { apiFetch } from '../lib/api'
import { supabase } from '../lib/supabase'

jest.mock('../lib/api', () => ({ apiFetch: jest.fn() }))
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}))

const auth = supabase.auth as unknown as Record<string, jest.Mock>
const unsubscribe = jest.fn()
let emitAuthChange: (event: string, session: unknown) => void

const session = { user: { id: 'u1' }, access_token: 'abc' }

const Probe = () => {
  const { status, signIn } = useAuth()
  return (
    <>
      <p>status: {status}</p>
      <button onClick={() => signIn('a@b.com', 'pw').then((m) => (document.title = String(m)))}>sign in</button>
    </>
  )
}

const renderProvider = () =>
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  )

beforeEach(() => {
  jest.resetAllMocks()
  auth.onAuthStateChange.mockImplementation((callback) => {
    emitAuthChange = callback
    return { data: { subscription: { unsubscribe } } }
  })
})

test('is signedOut when there is no session', async () => {
  auth.getSession.mockResolvedValue({ data: { session: null } })
  renderProvider()

  expect(await screen.findByText('status: signedOut')).toBeInTheDocument()
  expect(apiFetch).not.toHaveBeenCalled()
})

test('is admin when /api/auth/me succeeds', async () => {
  auth.getSession.mockResolvedValue({ data: { session } })
  ;(apiFetch as jest.Mock).mockResolvedValue({})
  renderProvider()

  expect(await screen.findByText('status: admin')).toBeInTheDocument()
  expect(apiFetch).toHaveBeenCalledWith('/api/auth/me')
})

test('is forbidden when /api/auth/me fails', async () => {
  auth.getSession.mockResolvedValue({ data: { session } })
  ;(apiFetch as jest.Mock).mockRejectedValue(new Error('403'))
  renderProvider()

  expect(await screen.findByText('status: forbidden')).toBeInTheDocument()
})

test('goes back to signedOut when the session ends', async () => {
  auth.getSession.mockResolvedValue({ data: { session } })
  ;(apiFetch as jest.Mock).mockResolvedValue({})
  renderProvider()
  await screen.findByText('status: admin')

  act(() => emitAuthChange('SIGNED_OUT', null))

  await waitFor(() => expect(screen.getByText('status: signedOut')).toBeInTheDocument())
})

test('signIn returns null on success and the error message on failure', async () => {
  auth.getSession.mockResolvedValue({ data: { session: null } })
  auth.signInWithPassword.mockResolvedValueOnce({ error: null })
  renderProvider()
  await screen.findByText('status: signedOut')

  await act(async () => screen.getByText('sign in').click())
  expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pw' })
  await waitFor(() => expect(document.title).toBe('null'))

  auth.signInWithPassword.mockResolvedValueOnce({ error: { message: 'Invalid login' } })
  await act(async () => screen.getByText('sign in').click())
  await waitFor(() => expect(document.title).toBe('Invalid login'))
})

test('unsubscribes from auth changes on unmount', async () => {
  auth.getSession.mockResolvedValue({ data: { session: null } })
  const { unmount } = renderProvider()
  await screen.findByText('status: signedOut')

  unmount()

  expect(unsubscribe).toHaveBeenCalled()
})

test('useAuth throws outside the provider', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(() => render(<Probe />)).toThrow('useAuth must be used inside AuthProvider')
})
