import { parseInlineFormatting } from '../components/formattedText/FormattedText'

// The site stores text as a small markdown subset: **bold**, *italic*, ***both***,
// [text](url), a blank line between paragraphs and a single newline for a line break.
// These helpers convert it to the HTML the editor shows and back, without changing
// anything the public FormattedText component understands.

const escapeHtml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const fromMarkdown = (text: string): string =>
    text
        .split(/\n\s*\n/)
        .filter((paragraph) => paragraph.trim() !== '')
        .map((paragraph) => `<p>${parseInlineFormatting(escapeHtml(paragraph.trim())).replace(/\n/g, '<br>')}</p>`)
        .join('')

type Mark = { type: string; attrs?: { href?: string } }
export type RichNode = { type?: string; text?: string; marks?: Mark[]; content?: RichNode[] }

const wrapText = (text: string, marks: Mark[] = []): string => {
    // Keep surrounding spaces outside the markers so we never write "** word**".
    const [, lead, core, trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(text) as RegExpExecArray
    if (!core) return text

    const bold = marks.some((mark) => mark.type === 'bold')
    const italic = marks.some((mark) => mark.type === 'italic')
    const link = marks.find((mark) => mark.type === 'link')

    let result = core
    if (bold && italic) result = `***${result}***`
    else if (bold) result = `**${result}**`
    else if (italic) result = `*${result}*`
    // ")" would end the link early in the site's parser.
    if (link?.attrs?.href) result = `[${result}](${link.attrs.href.replace(/\)/g, '%29').replace(/\s/g, '%20')})`

    return `${lead}${result}${trail}`
}

const paragraphToMarkdown = (paragraph: RichNode): string =>
    (paragraph.content ?? [])
        .map((node) => (node.type === 'hardBreak' ? '\n' : wrapText(node.text ?? '', node.marks)))
        .join('')
        .replace(/^\n+|\n+$/g, '')

export const toMarkdown = (doc: RichNode): string =>
    (doc.content ?? [])
        .filter((node) => node.type === 'paragraph')
        .map(paragraphToMarkdown)
        .filter((paragraph) => paragraph.trim() !== '')
        .join('\n\n')

// Returns a safe absolute URL, or null when the input is not a usable link.
export const normalizeUrl = (input: string): string | null => {
    const url = input.trim()
    if (!url || /\s/.test(url)) return null
    if (/^(https?:\/\/|mailto:|tel:)\S+/i.test(url)) return url
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return null // javascript:, data:, ...
    return /^[^\s/]+\.[^\s/]+/.test(url) ? `https://${url}` : null
}
