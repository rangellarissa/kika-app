import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { EditorContent, useEditor } from '@tiptap/react'
import { FaLink } from 'react-icons/fa'
import { useId, useState } from 'react'

import { extensions } from './richTextExtensions'
import { fromMarkdown, normalizeUrl, toMarkdown } from '../../lib/richText'

type RichTextEditorProps = {
    label: string
    // Text in the site's markdown format; read once, when the editor mounts.
    initialValue: string
    // Called with the same markdown format on every edit.
    onChange: (value: string) => void
}

const RichTextEditor = ({ label, initialValue, onChange }: RichTextEditorProps) => {
    const labelId = useId()
    const [linkOpen, setLinkOpen] = useState(false)
    const [url, setUrl] = useState('')
    const [urlError, setUrlError] = useState<string | null>(null)

    const editor = useEditor({
        extensions,
        content: fromMarkdown(initialValue),
        editorProps: {
            attributes: { role: 'textbox', 'aria-multiline': 'true', 'aria-labelledby': labelId },
        },
        onUpdate: ({ editor: current }) => onChange(toMarkdown(current.getJSON())),
    })

    if (!editor) return null

    const hasLink = editor.isActive('link')
    // A link needs some selected text, unless the cursor is already inside one.
    const canLink = hasLink || !editor.state.selection.empty

    const openLinkDialog = () => {
        setUrl(editor.getAttributes('link').href ?? '')
        setUrlError(null)
        setLinkOpen(true)
    }

    const applyLink = () => {
        const href = normalizeUrl(url)
        if (!href) {
            setUrlError('Digite um endereço válido, como https://exemplo.com')
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
        setLinkOpen(false)
    }

    const removeLink = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        setLinkOpen(false)
    }

    return (
        <div className="rich-editor">
            <span id={labelId} className="rich-editor__label" onClick={() => editor.chain().focus().run()}>
                {label}
            </span>

            <div className="rich-editor__toolbar" role="toolbar" aria-label="Formatação">
                <button
                    type="button"
                    className={`rich-editor__tool${editor.isActive('bold') ? ' rich-editor__tool--active' : ''}`}
                    aria-pressed={editor.isActive('bold')}
                    aria-label="Negrito"
                    title="Negrito (Ctrl+B)"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    className={`rich-editor__tool${editor.isActive('italic') ? ' rich-editor__tool--active' : ''}`}
                    aria-pressed={editor.isActive('italic')}
                    aria-label="Itálico"
                    title="Itálico (Ctrl+I)"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    className={`rich-editor__tool${hasLink ? ' rich-editor__tool--active' : ''}`}
                    aria-pressed={hasLink}
                    aria-label="Link"
                    title={canLink ? 'Link' : 'Selecione um texto para criar um link'}
                    disabled={!canLink}
                    onClick={openLinkDialog}
                >
                    <FaLink aria-hidden />
                </button>
            </div>

            <EditorContent editor={editor} />

            <Dialog open={linkOpen} onClose={() => setLinkOpen(false)} fullWidth maxWidth="sm" aria-label="Link">
                <DialogTitle className="admin__dialog-title">Link</DialogTitle>
                <DialogContent className="admin__form">
                    <label htmlFor="link-url">Endereço</label>
                    <input
                        id="link-url"
                        value={url}
                        placeholder="https://"
                        autoFocus
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                applyLink()
                            }
                        }}
                    />
                    {urlError && <p className="admin__error" role="alert">{urlError}</p>}
                </DialogContent>
                <DialogActions>
                    {hasLink && (
                        <button type="button" className="admin__button admin__button--delete" onClick={removeLink}>
                            Remover link
                        </button>
                    )}
                    <button type="button" className="admin__button" onClick={() => setLinkOpen(false)}>Cancelar</button>
                    <button type="button" className="admin__button admin__button--save" onClick={applyLink}>Aplicar</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default RichTextEditor
