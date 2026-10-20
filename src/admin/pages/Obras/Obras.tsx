import { FaArrowDown, FaArrowUp, FaPen, FaTrash } from 'react-icons/fa'
import { useCallback, useEffect, useState } from 'react'

import ConfirmDialog from '../../components/ConfirmDialog'
import { Obra } from '../../../types/types'
import ObraForm, { ObraValues } from './ObraForm'
import Toast, { ToastState } from '../../components/Toast'
import { apiFetch } from '../../../lib/api'
import { byOrder, moveItem, nextOrder } from '../../../lib/order'
import { uploadImage } from '../../../lib/upload'

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Algo deu errado.')

const Obras = () => {
    const [items, setItems] = useState<Obra[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [editing, setEditing] = useState<Obra | 'new' | null>(null)
    const [deleting, setDeleting] = useState<Obra | null>(null)
    const [deletingBusy, setDeletingBusy] = useState(false)
    const [moving, setMoving] = useState(false)
    const [toast, setToast] = useState<ToastState>(null)

    const load = useCallback(async () => {
        setLoadError(null)
        try {
            const data = await apiFetch<Obra[]>('/api/obra', { cache: 'no-store' })
            setItems([...data].sort(byOrder))
        } catch (e) {
            setLoadError(errorMessage(e))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const handleSave = async (values: ObraValues) => {
        const current = editing === 'new' ? null : editing

        let imageId = current?.image ?? null
        if (values.file) {
            imageId = (await uploadImage(values.file, values.titulo)).id
        }

        const fields = {
            titulo: values.titulo,
            ano: values.ano,
            tecnica: values.tecnica,
            dimensoes: values.dimensoes,
            image: imageId,
        }

        if (current) {
            // Editing never changes the position (that is done with the arrows) or disponivel.
            await apiFetch(`/api/obra/${current.id}`, { method: 'PUT', body: JSON.stringify(fields) })
        } else {
            // New obras start unavailable and go to the end of the list.
            await apiFetch('/api/obra', {
                method: 'POST',
                body: JSON.stringify({ ...fields, disponivel: false, ordem: nextOrder(items) }),
            })
        }

        setEditing(null)
        setToast({ message: current ? 'Obra atualizada.' : 'Obra publicada.', severity: 'success' })
        await load()
    }

    const handleMove = async (index: number, direction: -1 | 1) => {
        const changes = moveItem(items, index, index + direction)
        if (changes.length === 0) return

        setMoving(true)
        try {
            for (const change of changes) {
                await apiFetch(`/api/obra/${change.id}`, { method: 'PUT', body: JSON.stringify({ ordem: change.ordem }) })
            }
        } catch (e) {
            setToast({ message: errorMessage(e), severity: 'error' })
        } finally {
            // Always reload, so a partial failure shows the real order.
            await load()
            setMoving(false)
        }
    }

    const handleDelete = async () => {
        if (!deleting) return
        setDeletingBusy(true)
        try {
            await apiFetch(`/api/obra/${deleting.id}`, { method: 'DELETE' })
            setToast({ message: 'Obra excluída.', severity: 'success' })
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
                <h2>Trabalhos</h2>
                <button className="admin__button admin__button--save" onClick={() => setEditing('new')}>
                    Nova obra
                </button>
            </div>

            {loading && <p>Carregando...</p>}
            {loadError && (
                <p className="admin__error" role="alert">
                    {loadError} <button className="admin__button" onClick={load}>Tentar de novo</button>
                </p>
            )}
            {!loading && !loadError && items.length === 0 && <p>Nenhuma obra ainda.</p>}

            {items.length > 0 && (
                <table className="admin__table admin__table--obras">
                    <thead>
                        <tr>
                            <th>Ordem</th>
                            <th>Imagem</th>
                            <th>Título</th>
                            <th>Ano</th>
                            <th>Técnica</th>
                            <th>Dimensões</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id}>
                                <td className="admin__order">
                                    <button
                                        className="admin__button admin__icon-button"
                                        aria-label={`Mover ${item.titulo} para cima`}
                                        disabled={moving || index === 0}
                                        onClick={() => handleMove(index, -1)}
                                    >
                                        <FaArrowUp aria-hidden />
                                    </button>
                                    <button
                                        className="admin__button admin__icon-button"
                                        aria-label={`Mover ${item.titulo} para baixo`}
                                        disabled={moving || index === items.length - 1}
                                        onClick={() => handleMove(index, 1)}
                                    >
                                        <FaArrowDown aria-hidden />
                                    </button>
                                </td>
                                <td className="admin__cell-image">{item.imagem?.imageURL && <img src={item.imagem.imageURL} alt="" loading="lazy" />}</td>
                                <td className="admin__cell-title">{item.titulo}</td>
                                <td className="admin__cell-meta">{item.ano}</td>
                                <td className="admin__cell-meta">{item.tecnica}</td>
                                <td className="admin__cell-meta">{item.dimensoes}</td>
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
                <ObraForm obra={editing === 'new' ? null : editing} onSubmit={handleSave} onClose={() => setEditing(null)} />
            )}

            <ConfirmDialog
                open={!!deleting}
                title="Excluir obra"
                message={`Excluir "${deleting?.titulo}"? Isso não pode ser desfeito.`}
                busy={deletingBusy}
                onConfirm={handleDelete}
                onCancel={() => setDeleting(null)}
            />

            <Toast toast={toast} onClose={() => setToast(null)} />
        </section>
    )
}

export default Obras
