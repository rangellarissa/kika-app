import { displayDateValue, toDisplayDate, toDisplayMonth, toInputDate, toInputMonth } from './date'

test('converts between dd/mm/yyyy and yyyy-mm-dd', () => {
  expect(toInputDate('04/07/2026')).toBe('2026-07-04')
  expect(toDisplayDate('2026-07-04')).toBe('04/07/2026')
})

test('returns an empty string for incomplete dates', () => {
  expect(toInputDate('')).toBe('')
  expect(toDisplayDate('')).toBe('')
})

test('displayDateValue orders dates chronologically, not alphabetically', () => {
  expect(displayDateValue('28/05/2026')).toBeLessThan(displayDateValue('04/07/2026'))
  expect(displayDateValue('10/05/2026')).toBeLessThan(displayDateValue('10/05/2027'))
})

test('converts between mm/yyyy and yyyy-mm', () => {
  expect(toInputMonth('03/2026')).toBe('2026-03')
  expect(toDisplayMonth('2026-03')).toBe('03/2026')
  expect(toInputMonth('')).toBe('')
  expect(toDisplayMonth('')).toBe('')
})
