import { fromMarkdown, normalizeUrl, toMarkdown } from './richText'

// Minimal ProseMirror-style helpers to build documents.
const text = (value: string, ...marks: ({ type: string; attrs?: { href: string } })[]) => ({ type: 'text', text: value, marks })
const p = (...content: unknown[]) => ({ type: 'paragraph', content })
const doc = (...content: unknown[]) => ({ type: 'doc', content }) as never

describe('fromMarkdown', () => {
  test('splits paragraphs on blank lines and turns single newlines into line breaks', () => {
    expect(fromMarkdown('um\ndois\n\ntrês')).toBe('<p>um<br>dois</p><p>três</p>')
  })

  test('renders bold, italic, both and links like the public page', () => {
    expect(fromMarkdown('**a** *b* ***c*** [d](https://x.com)')).toBe(
      '<p><strong>a</strong> <em>b</em> <strong><em>c</em></strong> <a href="https://x.com" target="_blank" rel="noopener noreferrer">d</a></p>'
    )
  })

  test('escapes HTML so it is shown as text', () => {
    expect(fromMarkdown('a < b & <script>')).toBe('<p>a &lt; b &amp; &lt;script&gt;</p>')
  })

  test('ignores empty text and extra blank lines', () => {
    expect(fromMarkdown('')).toBe('')
    expect(fromMarkdown('\n\n  \n\num\n\n\n\ndois\n')).toBe('<p>um</p><p>dois</p>')
  })
})

describe('toMarkdown', () => {
  test('writes paragraphs and hard breaks', () => {
    expect(toMarkdown(doc(p(text('um'), { type: 'hardBreak' }, text('dois')), p(text('três'))))).toBe('um\ndois\n\ntrês')
  })

  test('writes bold, italic, both and links', () => {
    expect(
      toMarkdown(
        doc(
          p(
            text('a', { type: 'bold' }),
            text(' '),
            text('b', { type: 'italic' }),
            text(' '),
            text('c', { type: 'bold' }, { type: 'italic' }),
            text(' '),
            text('d', { type: 'link', attrs: { href: 'https://x.com' } })
          )
        )
      )
    ).toBe('**a** *b* ***c*** [d](https://x.com)')
  })

  test('puts a link around bold text', () => {
    expect(toMarkdown(doc(p(text('d', { type: 'bold' }, { type: 'link', attrs: { href: 'https://x.com' } }))))).toBe(
      '[**d**](https://x.com)'
    )
  })

  test('keeps spaces outside the markers', () => {
    expect(toMarkdown(doc(p(text('antes '), text(' palavra ', { type: 'bold' }), text('depois'))))).toBe('antes  **palavra** depois')
  })

  test('drops empty paragraphs and edge line breaks', () => {
    expect(toMarkdown(doc(p(), p({ type: 'hardBreak' }, text('um'), { type: 'hardBreak' }), p(text('  '))))).toBe('um')
  })

  test('encodes characters that would break the link syntax', () => {
    expect(toMarkdown(doc(p(text('x', { type: 'link', attrs: { href: 'https://a.com/(b) c' } }))))).toBe(
      '[x](https://a.com/(b%29%20c)'
    )
  })
})

describe('round trip', () => {
  const samples = [
    'Um parágrafo simples.',
    'Linha um\nlinha dois\n\nOutro parágrafo com **negrito**, *itálico* e [link](https://instagram.com/kika).',
    'Texto com ***negrito e itálico*** juntos.',
    '[**negrito dentro do link**](https://example.com/a?b=1&c=2)',
  ]

  // Simulates the editor: markdown -> HTML -> document -> markdown.
  const htmlToDoc = (html: string) => {
    const container = document.createElement('div')
    container.innerHTML = html
    const marksFor = (node: Node): { type: string; attrs?: { href: string } }[] => {
      const marks: { type: string; attrs?: { href: string } }[] = []
      for (let el = node.parentElement; el && el !== container; el = el.parentElement) {
        if (el.tagName === 'STRONG') marks.push({ type: 'bold' })
        if (el.tagName === 'EM') marks.push({ type: 'italic' })
        if (el.tagName === 'A') marks.push({ type: 'link', attrs: { href: el.getAttribute('href') as string } })
      }
      return marks
    }
    const inline = (el: Node): unknown[] =>
      Array.from(el.childNodes).flatMap((child) => {
        if (child.nodeName === 'BR') return [{ type: 'hardBreak' }]
        if (child.nodeType === Node.TEXT_NODE) return [text(child.textContent as string, ...marksFor(child))]
        return inline(child)
      })
    return doc(...Array.from(container.children).map((paragraph) => p(...inline(paragraph))))
  }

  test.each(samples)('keeps %j unchanged', (sample) => {
    expect(toMarkdown(htmlToDoc(fromMarkdown(sample)))).toBe(sample)
  })
})

describe('normalizeUrl', () => {
  test.each([
    ['https://example.com', 'https://example.com'],
    ['http://example.com/a?b=1', 'http://example.com/a?b=1'],
    ['mailto:oi@kikacarvalho.com.br', 'mailto:oi@kikacarvalho.com.br'],
    ['  instagram.com/kika ', 'https://instagram.com/kika'],
    ['www.example.com', 'https://www.example.com'],
  ])('accepts %j', (input, expected) => expect(normalizeUrl(input)).toBe(expected))

  test.each(['', '   ', 'javascript:alert(1)', 'data:text/html,x', 'sem espaço.com a', 'palavra'])('rejects %j', (input) =>
    expect(normalizeUrl(input)).toBeNull()
  )
})
