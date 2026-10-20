import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'

// Only what the public FormattedText component can render: bold, italic, links,
// paragraphs and line breaks. Everything else is switched off.
export const extensions = [
    StarterKit.configure({
        blockquote: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        listItem: false,
        orderedList: false,
        strike: false,
    }),
    Link.configure({ openOnClick: false, autolink: false, linkOnPaste: false }),
]
