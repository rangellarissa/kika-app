import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

import Pesquisa from './Pesquisa'
import { apiFetch } from '../../../lib/api'
import { uploadImage } from '../../../lib/upload'

jest.mock('../../../lib/api', () => ({ apiFetch: jest.fn() }))
jest.mock('../../components/RichTextEditor')
jest.mock('../../../lib/upload', () => ({
  ...jest.requireActual('../../../lib/upload'),
  uploadImage: jest.fn(),
}))

const api = apiFetch as jest.Mock

// The API returns imagem as the joined image, not as an id.
const older = { id: 1, titulo: 'Antiga', autora: 'Ana', texto: 'texto a', data: '2023-12-11', imagem: { imageURL: 'http://x/a.webp' } }
const newer = { id: 2, titulo: 'Recente', autora: 'Bia', texto: 'texto b', data: '2026-03-05', imagem: { imageURL: 'http://x/b.webp' } }

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

const fillForm = ({ titulo = 'Nova', autora = 'Cris', data = '2026-08-01', texto = 'corpo' } = {}) => {
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: titulo } })
  fireEvent.change(screen.getByLabelText('Autora'), { target: { value: autora } })
  fireEvent.change(screen.getByLabelText('Data'), { target: { value: data } })
  fireEvent.change(screen.getByLabelText('Texto'), { target: { value: texto } })
}

const pickImage = (type = 'image/webp') =>
  fireEvent.change(screen.getByLabelText(/Escolher imagem/), {
    target: { files: [new File(['x'], 'foto.webp', { type })] },
  })

test('lists pesquisas newest first with dd/mm/yyyy dates', async () => {
  render(<Pesquisa />)

  const rows = await screen.findAllByRole('row')
  expect(within(rows[1]).getByText('Recente')).toBeInTheDocument()
  expect(within(rows[1]).getByText('05/03/2026')).toBeInTheDocument()
  expect(within(rows[1]).getByText('Bia')).toBeInTheDocument()
  expect(within(rows[2]).getByText('Antiga')).toBeInTheDocument()
  expect(within(rows[2]).getByText('11/12/2023')).toBeInTheDocument()
  expect(api).toHaveBeenCalledWith('/api/research', { cache: 'no-store' })
})

test('says so when there is no pesquisa yet', async () => {
  api.mockResolvedValueOnce([])
  render(<Pesquisa />)

  expect(await screen.findByText('Nenhuma pesquisa ainda.')).toBeInTheDocument()
})

test('shows an error and lets the user retry when loading fails', async () => {
  api.mockRejectedValueOnce(new Error('Sem conexão'))
  render(<Pesquisa />)

  expect(await screen.findByRole('alert')).toHaveTextContent('Sem conexão')
  fireEvent.click(screen.getByText('Tentar de novo'))
  expect(await screen.findByText('Recente')).toBeInTheDocument()
})

test('requires title, author, date and text before saving', async () => {
  render(<Pesquisa />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova pesquisa', { selector: 'button' }))
  fireEvent.click(screen.getByText('Publicar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('Preencha título, autora, data e texto.')
  expect(calls('POST')).toHaveLength(0)
})

test('requires an image for a new pesquisa', async () => {
  render(<Pesquisa />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova pesquisa', { selector: 'button' }))
  fillForm()
  fireEvent.click(screen.getByText('Publicar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('Escolha uma imagem.')
  expect(uploadImage).not.toHaveBeenCalled()
})

test('rejects a file that is not an accepted image', async () => {
  render(<Pesquisa />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova pesquisa', { selector: 'button' }))
  pickImage('application/pdf')

  expect(await screen.findByRole('alert')).toHaveTextContent('JPG, PNG ou WebP')
})

test('uploads the image and creates the pesquisa', async () => {
  ;(uploadImage as jest.Mock).mockResolvedValue({ id: 99, imageURL: 'http://x/new.webp' })
  render(<Pesquisa />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getByText('Nova pesquisa', { selector: 'button' }))
  fillForm({ titulo: '  Nova  ', autora: ' Cris ' })
  pickImage()
  fireEvent.click(screen.getByText('Publicar'))

  await waitFor(() => expect(calls('POST')).toHaveLength(1))
  const [path, options] = calls('POST')[0]
  expect(path).toBe('/api/research')
  expect(JSON.parse(options.body)).toEqual({
    titulo: 'Nova',
    autora: 'Cris',
    data: '2026-08-01',
    texto: 'corpo',
    imagem: 99,
  })
  expect(await screen.findByText('Pesquisa publicada.')).toBeInTheDocument()
})

test('editing without a new file does not send imagem, so the current image stays', async () => {
  render(<Pesquisa />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getAllByText('Editar')[0])
  fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Recente editada' } })
  fireEvent.click(screen.getByText('Publicar'))

  await waitFor(() => expect(calls('PUT')).toHaveLength(1))
  const [path, options] = calls('PUT')[0]
  expect(path).toBe('/api/research/2')
  const body = JSON.parse(options.body)
  expect(body).toMatchObject({ titulo: 'Recente editada', autora: 'Bia', data: '2026-03-05' })
  expect(body).not.toHaveProperty('imagem')
  expect(uploadImage).not.toHaveBeenCalled()
  expect(await screen.findByText('Pesquisa atualizada.')).toBeInTheDocument()
})

test('editing with a new file replaces the image', async () => {
  ;(uploadImage as jest.Mock).mockResolvedValue({ id: 77, imageURL: 'http://x/n.webp' })
  render(<Pesquisa />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getAllByText('Editar')[0])
  fireEvent.change(screen.getByLabelText(/Alterar imagem/), {
    target: { files: [new File(['x'], 'nova.webp', { type: 'image/webp' })] },
  })
  fireEvent.click(screen.getByText('Publicar'))

  await waitFor(() => expect(calls('PUT')).toHaveLength(1))
  expect(JSON.parse(calls('PUT')[0][1].body)).toMatchObject({ imagem: 77 })
})

test('shows the API error inside the form when saving fails', async () => {
  api.mockImplementation(async (path: string, options?: RequestInit) => {
    if (options?.method === 'PUT') throw new Error('invalid input syntax')
    return [older, newer]
  })
  render(<Pesquisa />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getAllByText('Editar')[0])
  fireEvent.click(screen.getByText('Publicar'))

  expect(await screen.findByRole('alert')).toHaveTextContent('invalid input syntax')
  expect(screen.getByText('Publicar')).toBeEnabled()
})

test('deletes only after confirming', async () => {
  render(<Pesquisa />)
  await screen.findByText('Recente')

  fireEvent.click(screen.getAllByText('Excluir')[0])
  fireEvent.click(await screen.findByText('Cancelar'))
  expect(calls('DELETE')).toHaveLength(0)

  fireEvent.click(screen.getAllByText('Excluir')[0])
  const dialog = await screen.findByRole('dialog')
  fireEvent.click(within(dialog).getByText('Excluir'))

  await waitFor(() => expect(calls('DELETE')).toHaveLength(1))
  expect(calls('DELETE')[0][0]).toBe('/api/research/2')
  expect(await screen.findByText('Pesquisa excluída.')).toBeInTheDocument()
})
