import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

import Obras from './Obras'
import { apiFetch } from '../../../lib/api'
import { uploadImage } from '../../../lib/upload'

jest.mock('../../../lib/api', () => ({ apiFetch: jest.fn() }))
jest.mock('../../../lib/upload', () => ({
  ...jest.requireActual('../../../lib/upload'),
  uploadImage: jest.fn(),
}))

// jsdom does not implement these; ImageField uses them for the preview.
URL.createObjectURL = jest.fn(() => 'blob:preview')
URL.revokeObjectURL = jest.fn()

const api = apiFetch as jest.Mock

const obra = (id: number, titulo: string, ordem: number | null, extra = {}) => ({
  id,
  titulo,
  ano: '2022',
  tecnica: 'Óleo sobre tela',
  dimensoes: '120 x 120cm',
  disponivel: false,
  image: 10 + id,
  ordem,
  imagem: { imageURL: `http://x/${id}.jpg` },
  ...extra,
})

// Deliberately returned out of order; the page must sort by ordem.
const list = [obra(3, 'Terceira', 4), obra(1, 'Primeira', 2, { disponivel: true }), obra(2, 'Segunda', 3)]

const calls = (method: string) => api.mock.calls.filter(([, options]) => options?.method === method)
const bodyOf = (call: unknown[]) => JSON.parse((call[1] as RequestInit).body as string)
const titles = () => screen.getAllByRole('row').slice(1).map((row) => within(row).getAllByRole('cell')[2].textContent)

beforeEach(() => {
  jest.resetAllMocks()
  ;(URL.createObjectURL as jest.Mock).mockReturnValue('blob:preview')
  api.mockImplementation(async (path: string, options?: RequestInit) => (options?.method ? {} : list))
})

const pickImage = () =>
  fireEvent.change(screen.getByLabelText(/Escolher imagem/), {
    target: { files: [new File(['x'], 'foto.webp', { type: 'image/webp' })] },
  })

test('lists obras in ordem', async () => {
  render(<Obras />)

  await screen.findByText('Primeira')
  expect(titles()).toEqual(['Primeira', 'Segunda', 'Terceira'])
  expect(screen.queryByText('Disponível')).not.toBeInTheDocument()
  expect(api).toHaveBeenCalledWith('/api/obra', { cache: 'no-store' })
})

test('shows an error and lets the user retry when loading fails', async () => {
  api.mockRejectedValueOnce(new Error('Sem conexão'))
  render(<Obras />)

  expect(await screen.findByRole('alert')).toHaveTextContent('Sem conexão')
  fireEvent.click(screen.getByText('Tentar de novo'))
  expect(await screen.findByText('Primeira')).toBeInTheDocument()
})

test('the first row cannot go up and the last cannot go down', async () => {
  render(<Obras />)
  await screen.findByText('Primeira')

  expect(screen.getByLabelText('Mover Primeira para cima')).toBeDisabled()
  expect(screen.getByLabelText('Mover Terceira para baixo')).toBeDisabled()
  expect(screen.getByLabelText('Mover Primeira para baixo')).toBeEnabled()
})

test('moving a row down swaps the ordem of the two rows and reloads', async () => {
  render(<Obras />)
  await screen.findByText('Primeira')

  fireEvent.click(screen.getByLabelText('Mover Primeira para baixo'))

  await waitFor(() => expect(calls('PUT')).toHaveLength(2))
  expect(calls('PUT').map((c) => [c[0], bodyOf(c)])).toEqual([
    ['/api/obra/2', { ordem: 2 }],
    ['/api/obra/1', { ordem: 3 }],
  ])
  await waitFor(() => expect(api.mock.calls.filter(([, o]) => !o?.method || o.cache)).toHaveLength(2))
})

test('reloads and shows the error when a move fails halfway', async () => {
  api.mockImplementation(async (path: string, options?: RequestInit) => {
    if (options?.method === 'PUT') throw new Error('Falhou')
    return list
  })
  render(<Obras />)
  await screen.findByText('Primeira')

  fireEvent.click(screen.getByLabelText('Mover Primeira para baixo'))

  expect(await screen.findByText('Falhou')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByLabelText('Mover Primeira para baixo')).toBeEnabled())
})

test('requires a title and an image for a new obra', async () => {
  render(<Obras />)
  await screen.findByText('Primeira')

  fireEvent.click(screen.getByText('Nova obra', { selector: 'button' }))
  fireEvent.click(screen.getByText('Salvar'))
  expect(await screen.findByRole('alert')).toHaveTextContent('Preencha o título.')

  fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Nova' } })
  fireEvent.click(screen.getByText('Salvar'))
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Escolha uma imagem.'))
  expect(uploadImage).not.toHaveBeenCalled()
  expect(calls('POST')).toHaveLength(0)
})

test('uploads the image and creates the obra at the end of the list', async () => {
  ;(uploadImage as jest.Mock).mockResolvedValue({ id: 99, imageURL: 'http://x/new.webp' })
  render(<Obras />)
  await screen.findByText('Primeira')

  fireEvent.click(screen.getByText('Nova obra', { selector: 'button' }))
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: '  Nova  ' } })
  fireEvent.change(screen.getByLabelText('Ano'), { target: { value: '2026' } })
  fireEvent.change(screen.getByLabelText('Técnica'), { target: { value: 'Óleo' } })
  fireEvent.change(screen.getByLabelText('Dimensões'), { target: { value: '10 x 10cm' } })
  pickImage()
  fireEvent.click(screen.getByText('Salvar'))

  await waitFor(() => expect(calls('POST')).toHaveLength(1))
  const [path] = calls('POST')[0]
  expect(path).toBe('/api/obra')
  expect(bodyOf(calls('POST')[0])).toEqual({
    titulo: 'Nova',
    ano: '2026',
    tecnica: 'Óleo',
    dimensoes: '10 x 10cm',
    disponivel: false,
    image: 99,
    ordem: 5,
  })
  expect(uploadImage).toHaveBeenCalledWith(expect.any(File), 'Nova')
  expect(await screen.findByText('Obra publicada.')).toBeInTheDocument()
})

test('editing keeps the image, the position and disponivel when nothing else is chosen', async () => {
  render(<Obras />)
  await screen.findByText('Primeira')

  fireEvent.click(screen.getAllByText('Editar')[1])
  expect(screen.getByLabelText('Título')).toHaveValue('Segunda')
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Segunda editada' } })
  fireEvent.click(screen.getByText('Salvar'))

  await waitFor(() => expect(calls('PUT')).toHaveLength(1))
  expect(calls('PUT')[0][0]).toBe('/api/obra/2')
  const body = bodyOf(calls('PUT')[0])
  expect(body).toMatchObject({ titulo: 'Segunda editada', image: 12 })
  expect(body).not.toHaveProperty('ordem')
  expect(body).not.toHaveProperty('disponivel')
  expect(uploadImage).not.toHaveBeenCalled()
})

test('shows the API error inside the form when saving fails', async () => {
  api.mockImplementation(async (path: string, options?: RequestInit) => {
    if (options?.method === 'PUT') throw new Error('Acesso negado')
    return list
  })
  render(<Obras />)
  await screen.findByText('Primeira')

  fireEvent.click(screen.getAllByText('Editar')[0])
  fireEvent.click(screen.getByText('Salvar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('Acesso negado')
  expect(screen.getByText('Salvar')).toBeEnabled()
})

test('deletes only after confirming', async () => {
  render(<Obras />)
  await screen.findByText('Primeira')

  fireEvent.click(screen.getAllByText('Excluir')[0])
  fireEvent.click(await screen.findByText('Cancelar'))
  expect(calls('DELETE')).toHaveLength(0)

  fireEvent.click(screen.getAllByText('Excluir')[0])
  const dialog = await screen.findByRole('dialog')
  fireEvent.click(within(dialog).getByText('Excluir'))

  await waitFor(() => expect(calls('DELETE')).toHaveLength(1))
  expect(calls('DELETE')[0][0]).toBe('/api/obra/1')
  expect(await screen.findByText('Obra excluída.')).toBeInTheDocument()
})
