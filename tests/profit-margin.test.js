import { describe, expect, it } from 'vitest'
import { calculateProfitMargin, formatBusinessNumber } from '../lib/profit-margin.js'

describe('profit margin calculator', () => {
  it('calculates profit, margin, markup and totals', () => {
    const result = calculateProfitMargin(60, 100, 5)
    expect(result.profitPerUnit).toBe(40)
    expect(result.marginPercent).toBe(40)
    expect(result.markupPercent).toBeCloseTo(66.6666666667)
    expect(result.revenue).toBe(500)
    expect(result.totalCost).toBe(300)
    expect(result.totalProfit).toBe(200)
  })

  it('supports losses and zero cost explicitly', () => {
    expect(calculateProfitMargin(120, 100).marginPercent).toBe(-20)
    expect(calculateProfitMargin(0, 100).markupPercent).toBeNull()
  })

  it('rejects invalid values', () => {
    expect(() => calculateProfitMargin(-1, 10)).toThrow(/zero or greater/)
    expect(() => calculateProfitMargin(1, 0)).toThrow(/greater than zero/)
    expect(() => calculateProfitMargin(1, 2, 0)).toThrow(/greater than zero/)
    expect(() => calculateProfitMargin(Infinity, 2)).toThrow(/finite number/)
  })

  it('formats results cleanly', () => {
    expect(formatBusinessNumber(1234.5)).toBe('1,234.5')
    expect(formatBusinessNumber(-0)).toBe('0')
    expect(formatBusinessNumber(null)).toBe('Not defined')
  })
})
