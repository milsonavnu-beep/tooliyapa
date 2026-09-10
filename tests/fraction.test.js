import { describe, expect, it } from 'vitest'
import { calculateFraction, fractionToDecimalString, fractionToMixedString, fractionToPercentString, fractionToString, normalizeFraction } from '../lib/fraction.js'

describe('fraction calculator', () => {
  it('simplifies and normalizes exact fractions', () => {
    expect(normalizeFraction('6', '8')).toEqual({ numerator: 3n, denominator: 4n })
    expect(normalizeFraction('2', '-4')).toEqual({ numerator: -1n, denominator: 2n })
    expect(fractionToString(normalizeFraction('0', '5'))).toBe('0/1')
  })

  it('performs exact fraction arithmetic', () => {
    expect(calculateFraction('1', '3', '1', '6', 'add')).toEqual({ numerator: 1n, denominator: 2n })
    expect(calculateFraction('3', '4', '1', '2', 'subtract')).toEqual({ numerator: 1n, denominator: 4n })
    expect(calculateFraction('2', '3', '9', '10', 'multiply')).toEqual({ numerator: 3n, denominator: 5n })
    expect(calculateFraction('2', '3', '4', '5', 'divide')).toEqual({ numerator: 5n, denominator: 6n })
  })

  it('converts to mixed, decimal, and percentage forms', () => {
    const fraction = normalizeFraction('7', '3')
    expect(fractionToMixedString(fraction)).toBe('2 1/3')
    expect(fractionToDecimalString(fraction, 6)).toBe('2.333333…')
    expect(fractionToPercentString(normalizeFraction('1', '4'))).toBe('25%')
  })

  it('rejects invalid fractions', () => {
    expect(() => normalizeFraction('1.5', '2')).toThrow(/whole integer/)
    expect(() => normalizeFraction('1', '0')).toThrow(/must not be zero/)
    expect(() => calculateFraction('1', '2', '0', '3', 'divide')).toThrow(/zero fraction/)
  })

  it('handles integers beyond Number safe precision exactly', () => {
    const result = calculateFraction('9007199254740993', '2', '1', '2', 'add')
    expect(result).toEqual({ numerator: 4503599627370497n, denominator: 1n })
  })
})
