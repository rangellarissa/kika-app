import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Sobre from './Sobre'
import { apiFetch } from '../../../lib/api'

jest.mock('../../../lib/api', () => ({ apiFetch: jest.fn() }))
jest.mock('../../components/RichTextEditor')

const api = apiFetch as jest.Mock
const artist = { id: 1, name: 'KIKA CARVALHO', description: 'Texto original', date: '03/2026' }

beforeEach(() => {
  jest.resetAllMocks()
  api.mockResolvedValue(artist)
})

const waitForForm = () => screen.findByLabelText('Texto')

test('loads the text and month into the form, with no name field', async () => {
  render(<Sobre />)

  expect(await waitForForm()).toHaveValue('Texto original')
  expect(screen.queryByLabelText('Nome')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Atualizado em')).toHaveValue('2026-03')
  expect(api).toHaveBeenCalledWith('/api/artista/1', { cache: 'no-store' })
})

test('shows an error and lets the user retry when loading fails', async () => {
  api.mockRejectedValueOnce(new Error('Sem conexão'))
  render(<Sobre />)

  expect(await screen.findByRole('alert')).toHaveTextContent('Sem conexão')
  fireEvent.click(screen.getByText('Tentar de novo'))
  expect(await waitForForm()).toHaveValue('Texto original')
})

test('Salvar is disabled until something changes', async () => {
  render(<Sobre />)
  await waitForForm()
  const save = screen.getByText('Salvar')
  expect(save).toBeDisabled()

  fireEvent.change(screen.getByLabelText('Texto'), { target: { value: 'Novo texto' } })
  expect(save).toBeEnabled()

  fireEvent.change(screen.getByLabelText('Texto'), { target: { value: 'Texto original' } })
  expect(save).toBeDisabled()
})

test('requires the text', async () => {
  render(<Sobre />)
  await waitForForm()

  fireEvent.change(screen.getByLabelText('Texto'), { target: { value: '   ' } })
  fireEvent.click(screen.getByText('Salvar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('Preencha o texto.')
  expect(api).toHaveBeenCalledTimes(1)
})

test('saves with PUT without the name, converts the month back to mm/yyyy and confirms', async () => {
  render(<Sobre />)
  await waitForForm()
  api.mockResolvedValueOnce({ ...artist, description: 'Novo texto', date: '10/2026' })

  fireEvent.change(screen.getByLabelText('Texto'), { target: { value: 'Novo texto' } })
  fireEvent.change(screen.getByLabelText('Atualizado em'), { target: { value: '2026-10' } })
  fireEvent.click(screen.getByText('Salvar'))

  await waitFor(() => expect(api).toHaveBeenCalledTimes(2))
  const [path, options] = api.mock.calls[1]
  expect(path).toBe('/api/artista/1')
  expect(options.method).toBe('PUT')
  expect(JSON.parse(options.body)).toEqual({ description: 'Novo texto', date: '10/2026' })
  expect(await screen.findByText('Sobre atualizado.')).toBeInTheDocument()
  expect(screen.getByText('Salvar')).toBeDisabled()
})

test('shows the API error and keeps the edits when saving fails', async () => {
  render(<Sobre />)
  await waitForForm()
  api.mockRejectedValueOnce(new Error('Acesso negado'))

  fireEvent.change(screen.getByLabelText('Texto'), { target: { value: 'Novo texto' } })
  fireEvent.click(screen.getByText('Salvar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('Acesso negado')
  expect(screen.getByLabelText('Texto')).toHaveValue('Novo texto')
  expect(screen.getByText('Salvar')).toBeEnabled()
})
