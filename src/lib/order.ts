type Ordered = { id: number; ordem: number | null }

// Rows are shown by ordem ascending; rows without one go last.
export const byOrder = (a: Ordered, b: Ordered) => (a.ordem ?? Infinity) - (b.ordem ?? Infinity) || a.id - b.id

// Next free position, to put a new row at the end.
export const nextOrder = (items: Ordered[]) => Math.max(0, ...items.map((item) => item.ordem ?? 0)) + 1

// Moves the row at `from` to `to` in a list already sorted with byOrder and returns only the
// rows whose ordem must change. When every ordem is set and distinct, the existing values are
// reused so a move touches just the rows in between; otherwise the list is renumbered 1..n.
export function moveItem(items: Ordered[], from: number, to: number): { id: number; ordem: number }[] {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return []

    const moved = [...items]
    moved.splice(to, 0, ...moved.splice(from, 1))

    const current = items.map((item) => item.ordem)
    const reusable = current.every((ordem) => typeof ordem === 'number') && new Set(current).size === current.length
    const slots = reusable ? [...(current as number[])].sort((a, b) => a - b) : moved.map((_, index) => index + 1)

    const before = new Map(items.map((item) => [item.id, item.ordem]))
    return moved.map((item, index) => ({ id: item.id, ordem: slots[index] })).filter((row) => before.get(row.id) !== row.ordem)
}
