import { apiFetch } from './api'
import { supabase } from './supabase'

const BUCKET = 'kika-app'

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
// Limit for the file the user picks; it is shrunk before upload.
export const MAX_IMAGE_SIZE = 50 * 1024 * 1024
export const MAX_DIMENSION = 2400
const WEBP_QUALITY = 0.9
// Images that already fit are only re-encoded when they are heavier than this.
const REENCODE_ABOVE = 500 * 1024

export type UploadedImage = { id: number; imageURL: string }

type UploadUrl = { path: string; token: string; publicUrl: string }

export function validateImage(file: File): string | null {
    if (!IMAGE_TYPES.includes(file.type)) return 'Use uma imagem JPG, PNG ou WebP.'
    if (file.size > MAX_IMAGE_SIZE) return 'A imagem deve ter no máximo 50 MB.'
    return null
}

// Shrinks the long edge to MAX_DIMENSION and re-encodes as WebP. Keeps the file as is
// when it already fits and is small or WebP, or when re-encoding would make it bigger.
export async function compressImage(file: File): Promise<File> {
    let bitmap: ImageBitmap
    try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' } as unknown as ImageBitmapOptions)
    } catch {
        throw new Error('Não foi possível ler a imagem.')
    }

    try {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
        const fits = scale === 1
        if (fits && (file.type === 'image/webp' || file.size <= REENCODE_ABOVE)) return file

        const canvas = document.createElement('canvas')
        canvas.width = Math.round(bitmap.width * scale)
        canvas.height = Math.round(bitmap.height * scale)
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Não foi possível processar a imagem.')
        context.imageSmoothingQuality = 'high'
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY))
        if (!blob) throw new Error('Não foi possível processar a imagem.')
        if (fits && blob.size >= file.size) return file

        return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' })
    } finally {
        bitmap.close?.()
    }
}

// Compresses, then uploads straight to Storage with a signed URL, then registers it in the imagem table.
export async function uploadImage(original: File, legenda?: string): Promise<UploadedImage> {
    const file = await compressImage(original)

    const { path, token, publicUrl } = await apiFetch<UploadUrl>('/api/upload-url', {
        method: 'POST',
        body: JSON.stringify({ filename: file.name }),
    })

    const { error } = await supabase.storage.from(BUCKET).uploadToSignedUrl(path, token, file)
    if (error) throw new Error(error.message)

    // The API returns the inserted rows as an array.
    const [created] = await apiFetch<UploadedImage[]>('/api/imagem', {
        method: 'POST',
        body: JSON.stringify({ imageURL: publicUrl, legenda, destaque: false }),
    })
    return created
}
