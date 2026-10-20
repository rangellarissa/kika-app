import { FormEvent, useCallback, useEffect, useState } from 'react'

import { Artist } from '../../../types/types'
import Toast, { ToastState } from '../../components/Toast'
import { apiFetch } from '../../../lib/api'
import { toDisplayMonth, toInputMonth } from '../../../lib/date'

// The About page reads the single artista row with id 1.
const ARTIST_ID = 1

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Algo deu errado.')

const Sobre = () => {
    const [saved, setSaved] = useState<Artist | null>(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [month, setMonth] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [toast, setToast] = useState<ToastState>(null)

    const fill = (artist: Artist) => {
        setSaved(artist)
        setName(artist.name ?? '')
        setDescription(artist.description ?? '')
        setMonth(toInputMonth(artist.date ?? ''))
    }

    const load = useCallback(async () => {
        setLoadError(null)
        try {
            fill(await apiFetch<Artist>(`/api/artista/${ARTIST_ID}`, { cache: 'no-store' }))
        } catch (e) {
            setLoadError(errorMessage(e))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const dirty =
        !!saved &&
        (name !== (saved.name ?? '') ||
            description !== (saved.description ?? '') ||
            month !== toInputMonth(saved.date ?? ''))

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (!name.trim() || !description.trim()) {
            setError('Preencha nome e texto.')
            return
        }

        setError(null)
        setSaving(true)
        try {
            const updated = await apiFetch<Artist>(`/api/artista/${ARTIST_ID}`, {
                method: 'PUT',
                body: JSON.stringify({ name: name.trim(), description, date: toDisplayMonth(month) }),
            })
            fill(updated)
            setToast({ message: 'Sobre atualizado.', severity: 'success' })
        } catch (e) {
            setError(errorMessage(e))
        } finally {
            setSaving(false)
        }
    }

    return (
        <section>
            <div className="admin__section-header">
                <h2>Sobre</h2>
            </div>

            {loading && <p>Carregando...</p>}
            {loadError && (
                <p className="admin__error" role="alert">
                    {loadError} <button className="admin__button" onClick={load}>Tentar de novo</button>
                </p>
            )}

            {saved && (
                <form className="admin__form admin__form--page" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="name">Nome</label>
                    <input id="name" value={name} onChange={(e) => setName(e.target.value)} />

                    <label htmlFor="description">Texto</label>
                    <textarea id="description" rows={18} value={description} onChange={(e) => setDescription(e.target.value)} />
                    <small>Use **negrito**, *itálico* e [texto](link). Linha em branco separa parágrafos.</small>

                    <label htmlFor="month">Atualizado em</label>
                    <input id="month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />

                    {error && <p className="admin__error" role="alert">{error}</p>}

                    <div className="admin__form-actions">
                        <button type="submit" className="admin__button admin__button--save" disabled={saving || !dirty}>
                            {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>

                    <Toast toast={toast} onClose={() => setToast(null)} />
                </form>
            )}
        </section>
    )
}

export default Sobre
