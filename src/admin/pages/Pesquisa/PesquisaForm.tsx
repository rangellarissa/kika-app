import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material'
import { FormEvent, useState } from 'react'

import { ResearchProps } from '../../../types/types'
import ImageField from '../../components/ImageField'
import RichTextEditor from '../../components/RichTextEditor'

export type PesquisaValues = {
    titulo: string
    autora: string
    data: string // yyyy-mm-dd, which is also how research.data (a date column) is stored
    texto: string
    file: File | null
}

type PesquisaFormProps = {
    pesquisa: ResearchProps | null
    onSubmit: (values: PesquisaValues) => Promise<void>
    onClose: () => void
}

const PesquisaForm = ({ pesquisa, onSubmit, onClose }: PesquisaFormProps) => {
    const fullScreen = useMediaQuery('(max-width:768px)')
    const [titulo, setTitulo] = useState(pesquisa?.titulo ?? '')
    const [autora, setAutora] = useState(pesquisa?.autora ?? '')
    const [data, setData] = useState(pesquisa?.data ?? '')
    const [texto, setTexto] = useState(pesquisa?.texto ?? '')
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (!titulo.trim() || !autora.trim() || !data || !texto.trim()) {
            setError('Preencha título, autora, data e texto.')
            return
        }
        // The public page shows an image for every pesquisa.
        if (!file && !pesquisa?.imagem?.imageURL) {
            setError('Escolha uma imagem.')
            return
        }

        setError(null)
        setSaving(true)
        try {
            await onSubmit({ titulo: titulo.trim(), autora: autora.trim(), data, texto, file })
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Não foi possível salvar.')
            setSaving(false)
        }
    }

    return (
        <Dialog
            open
            fullScreen={fullScreen}
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="md"
            aria-label={pesquisa ? 'Editar pesquisa' : 'Nova pesquisa'}
        >
            {!pesquisa && <DialogTitle className="admin__dialog-title">Nova pesquisa</DialogTitle>}
            <form className="admin__dialog-form" onSubmit={handleSubmit} noValidate>
                <DialogContent className="admin__form">
                    <label htmlFor="titulo">Título</label>
                    <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

                    <label htmlFor="autora">Autora</label>
                    <input id="autora" value={autora} onChange={(e) => setAutora(e.target.value)} />

                    <label htmlFor="data">Data</label>
                    <input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} />

                    <RichTextEditor label="Texto" initialValue={pesquisa?.texto ?? ''} onChange={setTexto} />

                    <ImageField currentUrl={pesquisa?.imagem?.imageURL} file={file} onChange={setFile} onError={setError} />

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

export default PesquisaForm
