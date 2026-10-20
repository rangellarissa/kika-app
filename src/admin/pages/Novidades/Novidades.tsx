import { useCallback, useEffect, useState } from 'react'

import ConfirmDialog from '../../components/ConfirmDialog'
import { Novidade } from '../../../types/types'
import NovidadeForm, { NovidadeValues } from './NovidadeForm'
import Toast, { ToastState } from '../../components/Toast'
import { apiFetch } from '../../../lib/api'
import { displayDateValue, toDisplayDate } from '../../../lib/date'
import { uploadImage } from '../../../lib/upload'

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Algo deu errado.')

const Novidades = () => {
    const [items, setItems] = useState<Novidade[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [editing, setEditing] = useState<Novidade | 'new' | null>(null)
    const [deleting, setDeleting] = useState<Novidade | null>(null)
    const [deletingBusy, setDeletingBusy] = useState(false)
    const [toast, setToast] = useState<ToastState>(null)

    const load = useCallback(async () => {
        setLoadError(null)
        try {
            const data = await apiFetch<Novidade[]>('/api/novidade', { cache: 'no-store' })
            setItems([...data].sort((a, b) => displayDateValue(b.data) - displayDateValue(a.data)))
        } catch (e) {
            setLoadError(errorMessage(e))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const handleSave = async (values: NovidadeValues) => {
        const current = editing === 'new' ? null : editing
        const data = toDisplayDate(values.data)

        // novidade.data is unique in the database; check first for a friendlier message.
        if (items.some((item) => item.data === data && item.id !== current?.id)) {
            throw new Error('Já existe uma novidade nesta data.')
        }

        let imageId = current?.image ?? null
        if (values.file) {
            imageId = (await uploadImage(values.file, values.image_label)).id
        }

        const body = JSON.stringify({
            titulo: values.titulo,
            texto: values.texto,
            data,
            image: imageId,
            image_label: values.image_label,
        })

        if (current) {
            await apiFetch(`/api/novidade/${current.id}`, { method: 'PUT', body })
        } else {
            await apiFetch('/api/novidade', { method: 'POST', body })
        }

        setEditing(null)
        setToast({ message: current ? 'Novidade atualizada.' : 'Novidade publicada.', severity: 'success' })
        await load()
    }

    const handleDelete = async () => {
        if (!deleting) return
        setDeletingBusy(true)
        try {
            await apiFetch(`/api/novidade/${deleting.id}`, { method: 'DELETE' })
            setToast({ message: 'Novidade excluída.', severity: 'success' })
            setDeleting(null)
            await load()
        } catch (e) {
            setToast({ message: errorMessage(e), severity: 'error' })
        } finally {
            setDeletingBusy(false)
        }
    }

    return (
        <section>
            <div className="admin__section-header">
                <h2>Novidades</h2>
                <button className="admin__button admin__button--save" onClick={() => setEditing('new')}>
                    Nova novidade
                </button>
            </div>

            {loading && <p>Carregando...</p>}
            {loadError && (
                <p className="admin__error" role="alert">
                    {loadError} <button className="admin__button" onClick={load}>Tentar de novo</button>
                </p>
            )}
            {!loading && !loadError && items.length === 0 && <p>Nenhuma novidade ainda.</p>}

            {items.length > 0 && (
                <table className="admin__table">
                    <thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Data</th>
                            <th>Título</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.imagem?.imageURL && <img src={item.imagem.imageURL} alt="" loading="lazy" />}</td>
                                <td>{item.data}</td>
                                <td>{item.titulo}</td>
                                <td className="admin__table-actions">
                                    <button className="admin__button" onClick={() => setEditing(item)}>Editar</button>
                                    <button className="admin__button admin__button--delete" onClick={() => setDeleting(item)}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {editing && (
                <NovidadeForm
                    novidade={editing === 'new' ? null : editing}
                    onSubmit={handleSave}
                    onClose={() => setEditing(null)}
                />
            )}

            <ConfirmDialog
                open={!!deleting}
                title="Excluir novidade"
                message={`Excluir "${deleting?.titulo}"? Isso não pode ser desfeito.`}
                busy={deletingBusy}
                onConfirm={handleDelete}
                onCancel={() => setDeleting(null)}
            />

            <Toast toast={toast} onClose={() => setToast(null)} />
        </section>
    )
}

export default Novidades
