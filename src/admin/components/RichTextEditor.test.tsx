import { render, screen } from '@testing-library/react'

import RichTextEditor from './RichTextEditor'

const text = 'Um **negrito**, um *itálico* e um [link](https://example.com).\n\nSegundo parágrafo.'

test('shows the formatting instead of the markdown symbols', async () => {
  const { container } = render(<RichTextEditor label="Texto" initialValue={text} onChange={jest.fn()} />)

  const editor = await screen.findByRole('textbox', { name: 'Texto' })
  expect(editor).toHaveAttribute('contenteditable', 'true')
  expect(editor.querySelector('strong')).toHaveTextContent('negrito')
  expect(editor.querySelector('em')).toHaveTextContent('itálico')
  expect(editor.querySelector('a')).toHaveAttribute('href', 'https://example.com')
  expect(editor.querySelectorAll('p')).toHaveLength(2)
  expect(container).not.toHaveTextContent('**')
})

test('does not call onChange just for loading', async () => {
  const onChange = jest.fn()
  render(<RichTextEditor label="Texto" initialValue={text} onChange={onChange} />)
  await screen.findByRole('textbox', { name: 'Texto' })

  expect(onChange).not.toHaveBeenCalled()
})

test('has bold, italic and link buttons, and Link needs a selection', async () => {
  render(<RichTextEditor label="Texto" initialValue="Algum texto" onChange={jest.fn()} />)
  await screen.findByRole('textbox', { name: 'Texto' })

  expect(screen.getByRole('button', { name: 'Negrito' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Itálico' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Link' })).toBeDisabled()
})

test('never offers headings, lists or other formats the site cannot show', async () => {
  render(<RichTextEditor label="Texto" initialValue="# titulo\n\n- item" onChange={jest.fn()} />)
  const editor = await screen.findByRole('textbox', { name: 'Texto' })

  expect(editor.querySelector('h1, ul, ol, blockquote, pre, code')).toBeNull()
  expect(screen.getAllByRole('button')).toHaveLength(3)
})
