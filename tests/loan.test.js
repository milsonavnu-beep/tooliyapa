import { describe, expect, it } from 'vitest'
import { calculateLoanPayment, calculateLoanSummary, formatLoanAmount, formatLoanDuration } from '../lib/loan.js'

describe('loan calculator formulas', () => {
  it('calculates a fixed-rate monthly payment', () => {
    expect(calculateLoanPayment(100000, 6, 60)).toBeCloseTo(1933.2801529428275, 8)
    expect(calculateLoanPayment(300000, 7.5, 360)).toBeCloseTo(2097.6435256583295, 8)
  })

  it('supports zero-interest loans exactly', () => {
    expect(calculateLoanPayment(12000, 0, 12)).toBe(1000)
    const summary = calculateLoanSummary(12000, 0, 12)
    expect(summary.payoffMonths).toBe(12)
    expect(summary.totalInterest).toBe(0)
    expect(summary.totalPayment).toBe(12000)
  })

  it('calculates totals and the effect of extra monthly payments', () => {
    const baseline = calculateLoanSummary(100000, 6, 60)
    expect(baseline.payoffMonths).toBe(60)
    expect(baseline.totalInterest).toBeCloseTo(15996.809176567163, 6)
    expect(baseline.totalPayment).toBeCloseTo(115996.80917656707, 6)

    const faster = calculateLoanSummary(100000, 6, 60, 200)
    expect(faster.payoffMonths).toBe(54)
    expect(faster.monthsSaved).toBe(6)
    expect(faster.totalInterest).toBeCloseTo(14233.152904434484, 6)
    expect(faster.interestSaved).toBeGreaterThan(1700)
    expect(faster.totalInterest).toBeLessThan(baseline.totalInterest)
  })

  it('rejects invalid loan inputs', () => {
    expect(() => calculateLoanPayment(0, 6, 60)).toThrow(/greater than zero/)
    expect(() => calculateLoanPayment(1000, -1, 12)).toThrow(/zero or greater/)
    expect(() => calculateLoanPayment(1000, 5, 0)).toThrow(/1 to 1200/)
    expect(() => calculateLoanPayment(1000, 5, 12.5)).toThrow(/whole number/)
    expect(() => calculateLoanPayment(1000, 5, 1201)).toThrow(/1 to 1200/)
    expect(() => calculateLoanSummary(1000, 5, 12, -1)).toThrow(/zero or greater/)
    for (const invalid of [NaN, Infinity, -Infinity, '1000', null]) expect(() => calculateLoanPayment(invalid, 5, 12)).toThrow(/finite number/)
  })

  it('formats repayment amounts and durations readably', () => {
    expect(formatLoanAmount(1933.2801529)).toBe('1,933.28')
    expect(formatLoanAmount(-0)).toBe('0.00')
    expect(formatLoanDuration(54)).toBe('4 years 6 months')
    expect(formatLoanDuration(12)).toBe('1 year')
    expect(formatLoanDuration(1)).toBe('1 month')
    expect(formatLoanDuration(0)).toBe('0 months')
  })
})
