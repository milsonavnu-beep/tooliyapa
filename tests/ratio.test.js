import { describe, expect, it } from 'vitest'
import { formatProportionResult, formatRatio, proportionDecimal, simplifyRatio, solveProportion, splitTotalByRatio } from '../lib/ratio.js'

describe('Ratio Calculator math', () => {
  it('simplifies ordinary ratios exactly', () => {
    const result = simplifyRatio('12', '18')
    expect(result).toEqual({ left: 2n, right: 3n })
    expect(formatRatio(result.left, result.right)).toBe('2 : 3')
  })

  it('handles ratios beyond Number.MAX_SAFE_INTEGER without integer truncation', () => {
    const result = simplifyRatio('900719925474099300000000000000', '450359962737049650000000000000')
    expect(result).toEqual({ left: 2n, right: 1n })
  })

  it('normalizes ratio signs', () => {
    expect(simplifyRatio('-8', '-12')).toEqual({ left: 2n, right: 3n })
    expect(simplifyRatio('8', '-12')).toEqual({ left: -2n, right: 3n })
  })

  it('rejects a zero second term when simplifying', () => {
    expect(() => simplifyRatio('5', '0')).toThrow(/zero/i)
  })

  it('solves whole-number proportions', () => {
    const result = solveProportion('2', '3', '8')
    expect(result).toEqual({ numerator: 12n, denominator: 1n })
    expect(formatProportionResult(result)).toBe('12')
  })

  it('preserves an exact fractional proportion result', () => {
    const result = solveProportion('3', '4', '5')
    expect(result).toEqual({ numerator: 20n, denominator: 3n })
    expect(formatProportionResult(result)).toBe('20/3')
    expect(proportionDecimal(result)).toMatch(/^6\.666/)
  })

  it('rejects degenerate proportion terms', () => {
    expect(() => solveProportion('0', '2', '3')).toThrow(/first ratio term/i)
    expect(() => solveProportion('2', '3', '0')).toThrow(/third ratio term/i)
    expect(() => solveProportion('2', '0', '3')).toThrow(/zero/i)
  })

  it('splits a total according to positive ratio parts', () => {
    const result = splitTotalByRatio(120, '2', '3')
    expect(result.firstShare).toBeCloseTo(48, 12)
    expect(result.secondShare).toBeCloseTo(72, 12)
    expect(result.firstShare + result.secondShare).toBeCloseTo(120, 12)
  })

  it('validates split inputs', () => {
    expect(() => splitTotalByRatio(-1, '2', '3')).toThrow(/zero or greater/i)
    expect(() => splitTotalByRatio(Infinity, '2', '3')).toThrow(/finite/i)
    expect(() => splitTotalByRatio(100, '0', '3')).toThrow(/positive whole integers/i)
    expect(() => splitTotalByRatio(100, '2.5', '3')).toThrow(/whole integer/i)
  })
})
