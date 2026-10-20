import { MAX_DIMENSION, MAX_IMAGE_SIZE, compressImage, uploadImage, validateImage } from './upload'

import { apiFetch } from './api'
import { supabase } from './supabase'

jest.mock('./api', () => ({ apiFetch: jest.fn() }))
jest.mock('./supabase', () => ({
  supabase: { storage: { from: jest.fn() } },
}))

const uploadToSignedUrl = jest.fn()
const createImageBitmapMock = jest.fn()
const toBlob = jest.fn()
const drawImage = jest.fn()
const close = jest.fn()
const file = (type = 'image/webp', size = 10) =>
  Object.defineProperty(new File(['x'], 'foto.webp', { type }), 'size', { value: size })

// jsdom has no createImageBitmap or canvas, so both are faked.
const setImage = (width: number, height: number) => createImageBitmapMock.mockResolvedValue({ width, height, close })
const setEncodedSize = (size: number) =>
  toBlob.mockImplementation((callback: BlobCallback) => callback(new Blob([new Uint8Array(size)], { type: 'image/webp' })))

beforeEach(() => {
  jest.resetAllMocks()
  global.createImageBitmap = createImageBitmapMock
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({ drawImage })) as never
  HTMLCanvasElement.prototype.toBlob = toBlob
  setImage(100, 100)
  ;(supabase.storage.from as jest.Mock).mockReturnValue({ uploadToSignedUrl })
})

describe('validateImage', () => {
  test('accepts jpg, png and webp', () => {
    ;['image/jpeg', 'image/png', 'image/webp'].forEach((type) => expect(validateImage(file(type))).toBeNull())
  })

  test('rejects other types', () => {
    expect(validateImage(file('application/pdf'))).toMatch(/JPG, PNG ou WebP/)
  })

  test('rejects files over 50 MB', () => {
    expect(validateImage(file('image/png', MAX_IMAGE_SIZE + 1))).toMatch(/50 MB/)
  })

  test('accepts a large photo, since it is compressed before upload', () => {
    expect(validateImage(file('image/jpeg', 31 * 1024 * 1024))).toBeNull()
  })
})

describe('compressImage', () => {
  const photo = () => new File(['x'], 'IMS foto.JPG', { type: 'image/jpeg' })
  const sized = (size: number) => Object.defineProperty(photo(), 'size', { value: size })

  test('shrinks the long edge to the limit and converts to WebP', async () => {
    setImage(10198, 6187)
    setEncodedSize(300)

    const result = await compressImage(sized(30 * 1024 * 1024))

    expect(result.type).toBe('image/webp')
    expect(result.name).toBe('IMS foto.webp')
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, MAX_DIMENSION, 1456)
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.9)
    expect(close).toHaveBeenCalled()
  })

  test('keeps the orientation from the image metadata', async () => {
    setImage(5000, 3000)
    setEncodedSize(300)

    await compressImage(sized(5 * 1024 * 1024))

    expect(createImageBitmapMock).toHaveBeenCalledWith(expect.any(File), { imageOrientation: 'from-image' })
  })

  test('leaves a small image that already fits untouched', async () => {
    const original = sized(100 * 1024)
    await expect(compressImage(original)).resolves.toBe(original)
    expect(toBlob).not.toHaveBeenCalled()
  })

  test('leaves a WebP that already fits untouched', async () => {
    const original = file('image/webp', 5 * 1024 * 1024)
    await expect(compressImage(original)).resolves.toBe(original)
  })

  test('re-encodes a heavy image that already fits, when that makes it smaller', async () => {
    setImage(2000, 1000)
    setEncodedSize(200)

    const result = await compressImage(sized(4 * 1024 * 1024))

    expect(result.type).toBe('image/webp')
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 2000, 1000)
  })

  test('keeps the original when re-encoding would make a fitting image bigger', async () => {
    setImage(2000, 1000)
    setEncodedSize(2 * 1024 * 1024)
    const original = sized(1024 * 1024)

    await expect(compressImage(original)).resolves.toBe(original)
  })

  test('fails with a clear message when the image cannot be read', async () => {
    createImageBitmapMock.mockRejectedValue(new Error('decode'))
    await expect(compressImage(photo())).rejects.toThrow('Não foi possível ler a imagem.')
  })

  test('fails when the browser cannot encode WebP', async () => {
    setImage(5000, 3000)
    toBlob.mockImplementation((callback: BlobCallback) => callback(null))
    await expect(compressImage(sized(5 * 1024 * 1024))).rejects.toThrow('Não foi possível processar a imagem.')
    expect(close).toHaveBeenCalled()
  })
})

describe('uploadImage', () => {
  test('gets a signed URL, uploads the file and registers the imagem row', async () => {
    ;(apiFetch as jest.Mock)
      .mockResolvedValueOnce({ path: 'p.webp', token: 't', publicUrl: 'http://x/p.webp' })
      .mockResolvedValueOnce([{ id: 9, imageURL: 'http://x/p.webp' }])
    uploadToSignedUrl.mockResolvedValue({ error: null })
    const f = file()

    const result = await uploadImage(f, 'legenda')

    expect(result).toEqual({ id: 9, imageURL: 'http://x/p.webp' })
    expect(supabase.storage.from).toHaveBeenCalledWith('kika-app')
    expect(uploadToSignedUrl).toHaveBeenCalledWith('p.webp', 't', f)
    const [firstPath, firstOptions] = (apiFetch as jest.Mock).mock.calls[0]
    expect(firstPath).toBe('/api/upload-url')
    expect(JSON.parse(firstOptions.body)).toEqual({ filename: 'foto.webp' })
    const [secondPath, secondOptions] = (apiFetch as jest.Mock).mock.calls[1]
    expect(secondPath).toBe('/api/imagem')
    expect(JSON.parse(secondOptions.body)).toEqual({ imageURL: 'http://x/p.webp', legenda: 'legenda', destaque: false })
  })

  test('uploads the compressed WebP, not the original', async () => {
    setImage(10198, 6187)
    setEncodedSize(300)
    ;(apiFetch as jest.Mock)
      .mockResolvedValueOnce({ path: 'p.webp', token: 't', publicUrl: 'u' })
      .mockResolvedValueOnce([{ id: 1, imageURL: 'u' }])
    uploadToSignedUrl.mockResolvedValue({ error: null })
    const big = Object.defineProperty(new File(['x'], 'grande.jpg', { type: 'image/jpeg' }), 'size', { value: 30 * 1024 * 1024 })

    await uploadImage(big)

    const uploaded = uploadToSignedUrl.mock.calls[0][2] as File
    expect(uploaded.name).toBe('grande.webp')
    expect(uploaded.type).toBe('image/webp')
    expect(JSON.parse((apiFetch as jest.Mock).mock.calls[0][1].body)).toEqual({ filename: 'grande.webp' })
  })

  test('does not create the imagem row when the upload fails', async () => {
    ;(apiFetch as jest.Mock).mockResolvedValueOnce({ path: 'p', token: 't', publicUrl: 'u' })
    uploadToSignedUrl.mockResolvedValue({ error: { message: 'Bucket full' } })

    await expect(uploadImage(file())).rejects.toThrow('Bucket full')
    expect(apiFetch).toHaveBeenCalledTimes(1)
  })
})
