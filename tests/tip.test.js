import { describe, expect, it } from 'vitest'
import { calculateTip, formatTipNumber } from '../lib/tip.js'

describe('tip calculator', () => {
  it('calculates tip and totals', () => {
    const result = calculateTip(100, 20, 4)
    expect(result.tipAmount).toBe(20)
    expect(result.totalAmount).toBe(120)
    expect(result.tipPerPerson).toBe(5)
    expect(result.totalPerPerson).toBe(30)
  })

  it('supports a zero percent tip', () => {
    expect(calculateTip(50, 0, 2)).toMatchObject({ tipAmount: 0, totalAmount: 50, totalPerPerson: 25 })
  })

  it('validates bill, tip and people', () => {
    expect(() => calculateTip(0, 10)).toThrow(/greater than zero/)
    expect(() => calculateTip(10, -1)).toThrow(/zero or greater/)
    expect(() => calculateTip(10, 10, 1.5)).toThrow(/whole number/)
    expect(() => calculateTip(Infinity, 10)).toThrow(/finite number/)
  })

  it('formats ordinary money-like values', () => {
    expect(formatTipNumber(1234.5)).toBe('1,234.5')
    expect(formatTipNumber(10.456)).toBe('10.46')
  })
})
