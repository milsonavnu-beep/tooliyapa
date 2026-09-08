import { describe, expect, it } from 'vitest'
import { applyPercentageChange, calculatePercentageChange, calculatePercentOf, calculateWhatPercent, formatCalculatorNumber } from '../lib/percentage.js'

describe('percentage formulas', () => {
  it('calculates percentages of numbers including zero, negative and decimals', () => {
    expect(calculatePercentOf(20, 150)).toBe(30)
    expect(calculatePercentOf(0, 150)).toBe(0)
    expect(calculatePercentOf(100, 150)).toBe(150)
    expect(calculatePercentOf(-20, 150)).toBe(-30)
    expect(calculatePercentOf(12.5, 12.4)).toBeCloseTo(1.55)
  })
  it('calculates what percent and rejects a zero whole', () => {
    expect(calculateWhatPercent(45, 300)).toBe(15)
    expect(calculateWhatPercent(0, 300)).toBe(0)
    expect(calculateWhatPercent(1.5, -3)).toBe(-50)
    expect(() => calculateWhatPercent(2, 0)).toThrow(/must not be zero/)
  })
  it('classifies change values while enforcing a positive start', () => {
    expect(calculatePercentageChange(50, 75)).toBe(50)
    expect(calculatePercentageChange(100, 75)).toBe(-25)
    expect(calculatePercentageChange(100, 100)).toBe(0)
    expect(calculatePercentageChange(2.5, 3)).toBeCloseTo(20)
    expect(() => calculatePercentageChange(0, 1)).toThrow(/greater than zero/)
    expect(() => calculatePercentageChange(-1, 1)).toThrow(/greater than zero/)
  })
  it('applies increases and decreases', () => {
    expect(applyPercentageChange(200, 12.5, 'increase')).toBe(225)
    expect(applyPercentageChange(200, 12.5, 'decrease')).toBe(175)
    expect(applyPercentageChange(10.5, 150, 'decrease')).toBe(-5.25)
    expect(() => applyPercentageChange(1, -1, 'increase')).toThrow(/zero or greater/)
  })
  it('rejects invalid and non-finite values and formats floating point output', () => {
    for (const invalid of [NaN, Infinity, -Infinity, '20', null]) expect(() => calculatePercentOf(invalid, 2)).toThrow(/finite number/)
    expect(() => calculatePercentOf(Number.MAX_VALUE, Number.MAX_VALUE)).toThrow(/non-finite/)
    expect(formatCalculatorNumber(0.1 + 0.2)).toBe('0.3')
    expect(formatCalculatorNumber(30)).toBe('30')
    expect(formatCalculatorNumber(0.0000001)).toBe('0.0000001')
  })
})
