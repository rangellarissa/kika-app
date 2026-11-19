import { FaPen, FaTrash } from 'react-icons/fa'
import { useCallback, useEffect, useState } from 'react'

import ConfirmDialog from '../../components/ConfirmDialog'
import { ResearchProps } from '../../../types/types'
import PesquisaForm, { PesquisaValues } from './PesquisaForm'
import Toast, { ToastState } from '../../components/Toast'
import { apiFetch } from '../../../lib/api'
import { toDisplayDate } from '../../../lib/date'
import { uploadImage } from '../../../lib/upload'

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Algo deu errado.')

const Pesquisa = () => {
    const [items, setItems] = useState<ResearchProps[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [editing, setEditing] = useState<ResearchProps | 'new' | null>(null)
    const [deleting, setDeleting] = useState<ResearchProps | null>(null)
    const [deletingBusy, setDeletingBusy] = useState(false)
    const [toast, setToast] = useState<ToastState>(null)

    const load = useCallback(async () => {
        setLoadError(null)
        try {
            const data = await apiFetch<ResearchProps[]>('/api/research', { cache: 'no-store' })
            // research.data is a yyyy-mm-dd date, so plain string order is date order.
            setItems([...data].sort((a, b) => b.data.localeCompare(a.data)))
        } catch (e) {
            setLoadError(errorMessage(e))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const handleSave = async (values: PesquisaValues) => {
        const current = editing === 'new' ? null : editing

        const body: Record<string, unknown> = {
            titulo: values.titulo,
            autora: values.autora,
            data: values.data,
            texto: values.texto,
        }
        // The API returns imagem as the joined image, so only send it when a new file is chosen.
        if (values.file) {
            body.imagem = (await uploadImage(values.file)).id
        }

        if (current) {
            await apiFetch(`/api/research/${current.id}`, { method: 'PUT', body: JSON.stringify(body) })
        } else {
            await apiFetch('/api/research', { method: 'POST', body: JSON.stringify(body) })
        }

        setEditing(null)
        setToast({ message: current ? 'Pesquisa atualizada.' : 'Pesquisa publicada.', severity: 'success' })
        await load()
    }

    const handleDelete = async () => {
        if (!deleting) return
        setDeletingBusy(true)
        try {
            await apiFetch(`/api/research/${deleting.id}`, { method: 'DELETE' })
            setToast({ message: 'Pesquisa excluída.', severity: 'success' })
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
                <h2>Pesquisa</h2>
                <button className="admin__button admin__button--save" onClick={() => setEditing('new')}>
                    Nova pesquisa
                </button>
            </div>

            {loading && <p>Carregando...</p>}
            {loadError && (
                <p className="admin__error" role="alert">
                    {loadError} <button className="admin__button" onClick={load}>Tentar de novo</button>
                </p>
            )}
            {!loading && !loadError && items.length === 0 && <p>Nenhuma pesquisa ainda.</p>}

            {items.length > 0 && (
                <table className="admin__table admin__table--pesquisa">
                    <thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Data</th>
                            <th>Título</th>
                            <th>Autora</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="admin__cell-image">{item.imagem?.imageURL && <img src={item.imagem.imageURL} alt="" loading="lazy" />}</td>
                                <td className="admin__cell-date">{toDisplayDate(item.data)}</td>
                                <td className="admin__cell-title">{item.titulo}</td>
                                <td className="admin__cell-meta">{item.autora}</td>
                                <td className="admin__table-actions">
                                    <button className="admin__button" aria-label={`Editar ${item.titulo}`} onClick={() => setEditing(item)}>
                                        <FaPen className="admin__action-icon" aria-hidden />
                                        <span className="admin__action-label">Editar</span>
                                    </button>
                                    <button
                                        className="admin__button admin__button--delete"
                                        aria-label={`Excluir ${item.titulo}`}
                                        onClick={() => setDeleting(item)}
                                    >
                                        <FaTrash className="admin__action-icon" aria-hidden />
                                        <span className="admin__action-label">Excluir</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {editing && (
                <PesquisaForm
                    pesquisa={editing === 'new' ? null : editing}
                    onSubmit={handleSave}
                    onClose={() => setEditing(null)}
                />
            )}

            <ConfirmDialog
                open={!!deleting}
                title="Excluir pesquisa"
                message={`Excluir "${deleting?.titulo}"? Isso não pode ser desfeito.`}
                busy={deletingBusy}
                onConfirm={handleDelete}
                onCancel={() => setDeleting(null)}
            />

            <Toast toast={toast} onClose={() => setToast(null)} />
        </section>
    )
}

export default Pesquisa
