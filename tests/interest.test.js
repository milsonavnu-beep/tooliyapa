import { describe, expect, it } from 'vitest'
import { calculateAPY, calculateCompoundInterest, calculateSimpleInterest, formatInterestNumber } from '../lib/interest.js'

describe('interest calculator', () => {
  it('calculates simple interest', () => {
    expect(calculateSimpleInterest(1000, 5, 2)).toEqual({ interest: 100, finalAmount: 1100 })
    expect(calculateSimpleInterest(0, 5, 2)).toEqual({ interest: 0, finalAmount: 0 })
  })

  it('calculates compound growth and APY', () => {
    const result = calculateCompoundInterest({ principal: 1000, annualRatePercent: 12, years: 1, compoundsPerYear: 12 })
    expect(result.finalAmount).toBeCloseTo(1126.8250301, 6)
    expect(result.interestEarned).toBeCloseTo(126.8250301, 6)
    expect(result.apyPercent).toBeCloseTo(12.68250301, 6)
    expect(calculateAPY(0, 12)).toBe(0)
  })

  it('supports ordinary recurring contributions', () => {
    const result = calculateCompoundInterest({ principal: 0, annualRatePercent: 0, years: 1, compoundsPerYear: 12, contributionPerPeriod: 100 })
    expect(result.finalAmount).toBe(1200)
    expect(result.totalContributions).toBe(1200)
    expect(result.interestEarned).toBe(0)
  })

  it('validates unsafe or invalid inputs', () => {
    expect(() => calculateSimpleInterest(-1, 5, 1)).toThrow(/zero or greater/)
    expect(() => calculateCompoundInterest({ principal: 100, annualRatePercent: -1, years: 1, compoundsPerYear: 12 })).toThrow(/zero or greater/)
    expect(() => calculateCompoundInterest({ principal: 100, annualRatePercent: 5, years: 1.1, compoundsPerYear: 12 })).toThrow(/whole number of compounding periods/)
    expect(() => calculateAPY(5, 0)).toThrow(/whole number/)
    expect(() => calculateSimpleInterest(Infinity, 5, 1)).toThrow(/finite number/)
  })

  it('formats readable results', () => {
    expect(formatInterestNumber(1234.5)).toBe('1,234.5')
    expect(formatInterestNumber(-0)).toBe('0')
    expect(formatInterestNumber(1e20)).toMatch(/e20/)
  })
})
