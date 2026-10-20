// Plain textarea standing in for the TipTap editor in page tests (jsdom can't drive it).
type Props = { label: string; initialValue: string; onChange: (value: string) => void }

const RichTextEditor = ({ label, initialValue, onChange }: Props) => (
  <textarea aria-label={label} defaultValue={initialValue} onChange={(e) => onChange(e.target.value)} />
)

export default RichTextEditor
