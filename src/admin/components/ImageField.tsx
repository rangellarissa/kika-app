import { ChangeEvent, useEffect, useState } from 'react'

import { IMAGE_TYPES, validateImage } from '../../lib/upload'

type ImageFieldProps = {
    currentUrl?: string
    file: File | null
    onChange: (file: File | null) => void
    onError: (message: string | null) => void
}

// Picks an image and previews it; the upload happens when the parent form is saved.
const ImageField = ({ currentUrl, file, onChange, onError }: ImageFieldProps) => {
    const [preview, setPreview] = useState<string | undefined>(currentUrl)

    useEffect(() => {
        if (!file) {
            setPreview(currentUrl)
            return
        }
        const url = URL.createObjectURL(file)
        setPreview(url)
        return () => URL.revokeObjectURL(url)
    }, [file, currentUrl])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0] ?? null
        const message = selected ? validateImage(selected) : null
        onError(message)
        onChange(message ? null : selected)
        if (message) event.target.value = ''
    }

    return (
        <div className="admin__image-field">
            {preview && <img src={preview} alt="Pré-visualização" />}
            <label htmlFor="image-file">{preview ? 'Alterar imagem' : 'Escolher imagem'}</label>
            <input id="image-file" type="file" accept={IMAGE_TYPES.join(',')} onChange={handleChange} />
        </div>
    )
}

export default ImageField
