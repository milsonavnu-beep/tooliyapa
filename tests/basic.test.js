import { describe, expect, it } from 'vitest'
import { calculateBasic, formatBasicNumber } from '../lib/basic.js'

describe('basic calculator', () => {
  it('performs arithmetic operations', () => {
    expect(calculateBasic(2, 3, 'add')).toBe(5)
    expect(calculateBasic(2, 3, 'subtract')).toBe(-1)
    expect(calculateBasic(2, 3, 'multiply')).toBe(6)
    expect(calculateBasic(6, 3, 'divide')).toBe(2)
    expect(calculateBasic(2, 8, 'power')).toBe(256)
    expect(calculateBasic(10, 3, 'modulo')).toBe(1)
  })

  it('rejects invalid operations and zero divisors', () => {
    expect(() => calculateBasic(1, 0, 'divide')).toThrow(/must not be zero/)
    expect(() => calculateBasic(1, 0, 'modulo')).toThrow(/must not be zero/)
    expect(() => calculateBasic(1, 2, 'unknown')).toThrow(/supported operation/)
  })

  it('rejects non-finite inputs or outputs', () => {
    expect(() => calculateBasic(Infinity, 1, 'add')).toThrow(/finite number/)
    expect(() => calculateBasic(Number.MAX_VALUE, 2, 'multiply')).toThrow(/non-finite result/)
  })

  it('formats floating point output readably', () => {
    expect(formatBasicNumber(0.1 + 0.2)).toBe('0.3')
    expect(formatBasicNumber(-0)).toBe('0')
    expect(formatBasicNumber(1e20)).toMatch(/e20/)
  })
})
