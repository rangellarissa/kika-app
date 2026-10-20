import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material'
import { FormEvent, useState } from 'react'

import ImageField from '../../components/ImageField'
import { Obra } from '../../../types/types'

export type ObraValues = {
    titulo: string
    ano: string
    tecnica: string
    dimensoes: string
    file: File | null
}

type ObraFormProps = {
    obra: Obra | null
    onSubmit: (values: ObraValues) => Promise<void>
    onClose: () => void
}

const ObraForm = ({ obra, onSubmit, onClose }: ObraFormProps) => {
    const fullScreen = useMediaQuery('(max-width:768px)')
    const [titulo, setTitulo] = useState(obra?.titulo ?? '')
    const [ano, setAno] = useState(obra?.ano ?? '')
    const [tecnica, setTecnica] = useState(obra?.tecnica ?? '')
    const [dimensoes, setDimensoes] = useState(obra?.dimensoes ?? '')
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (!titulo.trim()) {
            setError('Preencha o título.')
            return
        }
        // The public page needs an image for every obra.
        if (!file && !obra?.imagem?.imageURL) {
            setError('Escolha uma imagem.')
            return
        }

        setError(null)
        setSaving(true)
        try {
            await onSubmit({
                titulo: titulo.trim(),
                ano: ano.trim(),
                tecnica: tecnica.trim(),
                dimensoes: dimensoes.trim(),
                file,
            })
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
            aria-label={obra ? 'Editar obra' : 'Nova obra'}
        >
            {!obra && <DialogTitle className="admin__dialog-title">Nova obra</DialogTitle>}
            <form className="admin__dialog-form" onSubmit={handleSubmit} noValidate>
                <DialogContent className="admin__form">
                    <label htmlFor="titulo">Título</label>
                    <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

                    <label htmlFor="ano">Ano</label>
                    <input id="ano" value={ano} onChange={(e) => setAno(e.target.value)} />

                    <label htmlFor="tecnica">Técnica</label>
                    <input id="tecnica" value={tecnica} onChange={(e) => setTecnica(e.target.value)} />

                    <label htmlFor="dimensoes">Dimensões</label>
                    <input id="dimensoes" value={dimensoes} onChange={(e) => setDimensoes(e.target.value)} />

                    <ImageField currentUrl={obra?.imagem?.imageURL} file={file} onChange={setFile} onError={setError} />

                    {error && <p className="admin__error" role="alert">{error}</p>}
                </DialogContent>
                <DialogActions>
                    <button type="button" className="admin__button" onClick={onClose} disabled={saving}>Cancelar</button>
                    <button type="submit" className="admin__button admin__button--save" disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default ObraForm
