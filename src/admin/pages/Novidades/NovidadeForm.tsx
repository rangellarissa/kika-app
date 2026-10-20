import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormEvent, useState } from 'react'

import { Novidade } from '../../../types/types'
import ImageField from '../../components/ImageField'
import RichTextEditor from '../../components/RichTextEditor'
import { toInputDate } from '../../../lib/date'

export type NovidadeValues = {
    titulo: string
    data: string // yyyy-mm-dd, as <input type="date"> returns it
    texto: string
    image_label: string
    file: File | null
}

type NovidadeFormProps = {
    novidade: Novidade | null
    onSubmit: (values: NovidadeValues) => Promise<void>
    onClose: () => void
}

const NovidadeForm = ({ novidade, onSubmit, onClose }: NovidadeFormProps) => {
    const [titulo, setTitulo] = useState(novidade?.titulo ?? '')
    const [data, setData] = useState(novidade ? toInputDate(novidade.data) : '')
    const [texto, setTexto] = useState(novidade?.texto ?? '')
    const [imageLabel, setImageLabel] = useState(novidade?.image_label ?? '')
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (!titulo.trim() || !data || !texto.trim()) {
            setError('Preencha título, data e texto.')
            return
        }
        // The public page needs an image for every novidade.
        if (!file && !novidade?.imagem?.imageURL) {
            setError('Escolha uma imagem.')
            return
        }

        setError(null)
        setSaving(true)
        try {
            await onSubmit({ titulo: titulo.trim(), data, texto, image_label: imageLabel.trim(), file })
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Não foi possível salvar.')
            setSaving(false)
        }
    }

    return (
        <Dialog
            open
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="md"
            aria-label={novidade ? 'Editar novidade' : 'Nova novidade'}
        >
            {!novidade && <DialogTitle className="admin__dialog-title">Nova novidade</DialogTitle>}
            <form onSubmit={handleSubmit} noValidate>
                <DialogContent className="admin__form">
                    <label htmlFor="titulo">Título</label>
                    <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

                    <label htmlFor="data">Data</label>
                    <input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />

                    <RichTextEditor label="Texto" initialValue={novidade?.texto ?? ''} onChange={setTexto} />

                    <ImageField currentUrl={novidade?.imagem?.imageURL} file={file} onChange={setFile} onError={setError} />

                    <label htmlFor="image-label">Legenda da imagem</label>
                    <input id="image-label" value={imageLabel} onChange={(e) => setImageLabel(e.target.value)} />

                    {error && <p className="admin__error" role="alert">{error}</p>}
                </DialogContent>
                <DialogActions>
                    <button type="button" className="admin__button" onClick={onClose} disabled={saving}>Cancelar</button>
                    <button type="submit" className="admin__button admin__button--save" disabled={saving}>
                        {saving ? 'Salvando...' : 'Publicar'}
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default NovidadeForm
