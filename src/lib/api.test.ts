import { ApiError, apiFetch } from './api'

import { supabase } from './supabase'

jest.mock('./supabase', () => ({
  supabase: { auth: { getSession: jest.fn() } },
}))

const getSession = supabase.auth.getSession as jest.Mock
const fetchMock = jest.fn()

beforeEach(() => {
  fetchMock.mockReset()
  global.fetch = fetchMock
  getSession.mockResolvedValue({ data: { session: { access_token: 'abc' } } })
})

test('sends the access token and parses JSON', async () => {
  fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: 1 }) })

  const result = await apiFetch('/api/obra')

  expect(result).toEqual({ id: 1 })
  const [url, options] = fetchMock.mock.calls[0]
  expect(url).toBe('http://api.test/api/obra')
  expect(options.headers.get('Authorization')).toBe('Bearer abc')
})

test('does not send Authorization without a session', async () => {
  getSession.mockResolvedValue({ data: { session: null } })
  fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => [] })

  await apiFetch('/api/obra')

  expect(fetchMock.mock.calls[0][1].headers.has('Authorization')).toBe(false)
})

test('sets the JSON content type when there is a body', async () => {
  fetchMock.mockResolvedValue({ ok: true, status: 201, json: async () => ({}) })

  await apiFetch('/api/obra', { method: 'POST', body: '{}' })

  expect(fetchMock.mock.calls[0][1].headers.get('Content-Type')).toBe('application/json')
})

test('returns undefined for 204 responses', async () => {
  fetchMock.mockResolvedValue({ ok: true, status: 204 })

  await expect(apiFetch('/api/obra/1', { method: 'DELETE' })).resolves.toBeUndefined()
})

test('throws ApiError with the server message on failure', async () => {
  fetchMock.mockResolvedValue({
    ok: false,
    status: 403,
    statusText: 'Forbidden',
    json: async () => ({ message: 'Acesso negado' }),
  })

  await expect(apiFetch('/api/auth/me')).rejects.toMatchObject({
    status: 403,
    message: 'Acesso negado',
  })
  await expect(apiFetch('/api/auth/me')).rejects.toBeInstanceOf(ApiError)
})
