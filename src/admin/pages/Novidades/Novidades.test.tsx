import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

import Novidades from './Novidades'
import { apiFetch } from '../../../lib/api'
import { uploadImage } from '../../../lib/upload'

jest.mock('../../../lib/api', () => ({ apiFetch: jest.fn() }))
jest.mock('../../components/RichTextEditor')
jest.mock('../../../lib/upload', () => ({
  ...jest.requireActual('../../../lib/upload'),
  uploadImage: jest.fn(),
}))

const api = apiFetch as jest.Mock

const older = { id: 1, titulo: 'Antiga', texto: 'texto a', data: '28/05/2026', image: 10, image_label: 'a', imagem: { imageURL: 'http://x/a.webp' } }
const newer = { id: 2, titulo: 'Recente', texto: 'texto b', data: '04/07/2026', image: 11, image_label: 'b', imagem: { imageURL: 'http://x/b.webp' } }

const calls = (method: string) => api.mock.calls.filter(([, options]) => options?.method === method)

// jsdom does not implement these; ImageField uses them for the preview.
URL.createObjectURL = jest.fn(() => 'blob:preview')
URL.revokeObjectURL = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
  ;(URL.createObjectURL as jest.Mock).mockReturnValue('blob:preview')
  api.mockImplementation(async (path: string, options?: RequestInit) => {
    if (!options?.method) return [older, newer]
    return {}
  })
})

const fillForm = ({ titulo = 'Nova', data = '2026-08-01', texto = 'corpo' } = {}) => {
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: titulo } })
  fireEvent.change(screen.getByLabelText('Data'), { target: { value: data } })
  fireEvent.change(screen.getByLabelText('Texto'), { target: { value: texto } })
}

const pickImage = (type = 'image/webp') =>
  fireEvent.change(screen.getByLabelText(/Escolher imagem/), {
    target: { files: [new File(['x'], 'foto.webp', { type })] },
  })

test('lists novidades newest first', async () => {
  render(<Novidades />)

  const rows = await screen.findAllByRole('row')
  expect(within(rows[1]).getByText('Recente')).toBeInTheDocument()
  expect(within(rows[2]).getByText('Antiga')).toBeInTheDocument()
  expect(api).toHaveBeenCalledWith('/api/novidade', { cache: 'no-store' })
})

test('shows an error and lets the user retry when loading fails', async () => {
  api.mockRejectedValueOnce(new Error('Sem conexão'))
  render(<Novidades />)

  expect(await screen.findByRole('alert')).toHaveTextContent('Sem conexão')
  fireEvent.click(screen.getByText('Tentar de novo'))
  expect(await screen.findByText('Recente')).toBeInTheDocument()
})

test('requires title, date and text before saving', async () => {
  render(<Novidades />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova novidade', { selector: 'button' }))
  fireEvent.click(screen.getByText('Publicar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('Preencha título, data e texto.')
  expect(calls('POST')).toHaveLength(0)
})

test('requires an image for a new novidade', async () => {
  render(<Novidades />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova novidade', { selector: 'button' }))
  fillForm()
  fireEvent.click(screen.getByText('Publicar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('Escolha uma imagem.')
  expect(uploadImage).not.toHaveBeenCalled()
})

test('rejects a file that is not an accepted image', async () => {
  render(<Novidades />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova novidade', { selector: 'button' }))
  pickImage('application/pdf')

  expect(await screen.findByRole('alert')).toHaveTextContent('JPG, PNG ou WebP')
})

test('blocks a date that is already used', async () => {
  render(<Novidades />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova novidade', { selector: 'button' }))
  fillForm({ data: '2026-07-04' })
  pickImage()
  fireEvent.click(screen.getByText('Publicar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('Já existe uma novidade nesta data.')
  expect(uploadImage).not.toHaveBeenCalled()
  expect(calls('POST')).toHaveLength(0)
})

test('uploads the image and creates the novidade', async () => {
  ;(uploadImage as jest.Mock).mockResolvedValue({ id: 99, imageURL: 'http://x/new.webp' })
  render(<Novidades />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova novidade', { selector: 'button' }))
  fillForm({ titulo: '  Nova  ', data: '2026-08-01' })
  fireEvent.change(screen.getByLabelText('Legenda da imagem'), { target: { value: 'Foto' } })
  pickImage()
  fireEvent.click(screen.getByText('Publicar'))

  await waitFor(() => expect(calls('POST')).toHaveLength(1))
  const [path, options] = calls('POST')[0]
  expect(path).toBe('/api/novidade')
  expect(JSON.parse(options.body)).toEqual({
    titulo: 'Nova',
    texto: 'corpo',
    data: '01/08/2026',
    image: 99,
    image_label: 'Foto',
  })
  expect(uploadImage).toHaveBeenCalledWith(expect.any(File), 'Foto')
  expect(await screen.findByText('Novidade publicada.')).toBeInTheDocument()
})

test('editing keeps the current image when no new file is chosen', async () => {
  render(<Novidades />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getAllByText('Editar')[0])
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Recente editada' } })
  fireEvent.click(screen.getByText('Publicar'))

  await waitFor(() => expect(calls('PUT')).toHaveLength(1))
  const [path, options] = calls('PUT')[0]
  expect(path).toBe('/api/novidade/2')
  expect(JSON.parse(options.body)).toMatchObject({ titulo: 'Recente editada', data: '04/07/2026', image: 11 })
  expect(uploadImage).not.toHaveBeenCalled()
})

test('shows the API error inside the form when saving fails', async () => {
  api.mockImplementation(async (path: string, options?: RequestInit) => {
    if (options?.method === 'PUT') throw new Error('duplicate key value')
    return [older, newer]
  })
  render(<Novidades />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getAllByText('Editar')[0])
  fireEvent.click(screen.getByText('Publicar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('duplicate key value')
  expect(screen.getByText('Publicar')).toBeEnabled()
})

test('deletes only after confirming', async () => {
  render(<Novidades />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getAllByText('Excluir')[0])
  fireEvent.click(await screen.findByText('Cancelar'))
  expect(calls('DELETE')).toHaveLength(0)

  fireEvent.click(screen.getAllByText('Excluir')[0])
  const dialog = await screen.findByRole('dialog')
  fireEvent.click(within(dialog).getByText('Excluir'))

  await waitFor(() => expect(calls('DELETE')).toHaveLength(1))
  expect(calls('DELETE')[0][0]).toBe('/api/novidade/2')
  expect(await screen.findByText('Novidade excluída.')).toBeInTheDocument()
})
