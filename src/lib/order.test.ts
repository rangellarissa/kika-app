import { byOrder, moveItem, nextOrder } from './order'

const rows = (...ordens: (number | null)[]) => ordens.map((ordem, i) => ({ id: i + 1, ordem }))

test('byOrder sorts ascending, rows without ordem last, ties by id', () => {
  const sorted = [{ id: 3, ordem: null }, { id: 2, ordem: 5 }, { id: 1, ordem: 5 }, { id: 4, ordem: 2 }].sort(byOrder)
  expect(sorted.map((r) => r.id)).toEqual([4, 1, 2, 3])
})

test('nextOrder puts a new row at the end', () => {
  expect(nextOrder(rows(2, 3, 13))).toBe(14)
  expect(nextOrder([])).toBe(1)
  expect(nextOrder(rows(null))).toBe(1)
})

describe('moveItem', () => {
  test('moving down swaps just the two rows when ordem values are distinct', () => {
    expect(moveItem(rows(2, 3, 4), 0, 1)).toEqual([
      { id: 2, ordem: 2 },
      { id: 1, ordem: 3 },
    ])
  })

  test('moving up swaps just the two rows, keeping gaps', () => {
    expect(moveItem(rows(2, 5, 9), 2, 1)).toEqual([
      { id: 3, ordem: 5 },
      { id: 2, ordem: 9 },
    ])
  })

  test('a longer move only shifts the rows in between', () => {
    expect(moveItem(rows(1, 2, 3, 4), 0, 2)).toEqual([
      { id: 2, ordem: 1 },
      { id: 3, ordem: 2 },
      { id: 1, ordem: 3 },
    ])
  })

  test('renumbers 1..n when ordem values are duplicated', () => {
    // Row 2 already has ordem 1, so only the rows whose value changes are returned.
    expect(moveItem(rows(1, 1, 1), 0, 1)).toEqual([
      { id: 1, ordem: 2 },
      { id: 3, ordem: 3 },
    ])
  })

  test('renumbers 1..n when a row has no ordem', () => {
    expect(moveItem(rows(1, null), 1, 0)).toEqual([
      { id: 2, ordem: 1 },
      { id: 1, ordem: 2 },
    ])
  })

  test('does nothing for no-op or out-of-range moves', () => {
    expect(moveItem(rows(1, 2), 0, 0)).toEqual([])
    expect(moveItem(rows(1, 2), 0, 2)).toEqual([])
    expect(moveItem(rows(1, 2), -1, 0)).toEqual([])
  })
})
