import { formatRelativeTime } from './time'

describe('formatRelativeTime', () => {
  const now = new Date('2026-11-21T12:00:00Z').getTime()

  test('returns "только что" for fresh updates', () => {
    expect(formatRelativeTime(now - 1000, now)).toBe('только что')
  })

  test('does not return negative values for future timestamps', () => {
    expect(formatRelativeTime(now + 5000, now)).toBe('только что')
  })

  test('formats seconds', () => {
    expect(formatRelativeTime(now - 30000, now)).toBe('30 сек. назад')
  })

  test('formats minutes', () => {
    expect(formatRelativeTime(now - 5 * 60000, now)).toBe('5 мин. назад')
  })

  test('formats hours', () => {
    expect(formatRelativeTime(now - 3 * 3600000, now)).toBe('3 ч. назад')
  })

  test('formats days', () => {
    expect(formatRelativeTime(now - 2 * 86400000, now)).toBe('2 д. назад')
  })
})
