import { describe, expect, it } from 'vitest'
import { formatElectricalNumber, solveElectrical } from '../lib/electrical.js'

function expectStandard(result) {
  expect(result.voltage).toBeCloseTo(120, 12)
  expect(result.current).toBeCloseTo(10, 12)
  expect(result.resistance).toBeCloseTo(12, 12)
  expect(result.power).toBeCloseTo(1200, 12)
}

describe('Electrical Calculator math', () => {
  it('solves from voltage and current', () => {
    expectStandard(solveElectrical('voltage-current', 120, 10))
  })

  it('solves from voltage and resistance', () => {
    expectStandard(solveElectrical('voltage-resistance', 120, 12))
  })

  it('solves from voltage and power', () => {
    expectStandard(solveElectrical('voltage-power', 120, 1200))
  })

  it('solves from current and resistance', () => {
    expectStandard(solveElectrical('current-resistance', 10, 12))
  })

  it('solves from current and power', () => {
    expectStandard(solveElectrical('current-power', 10, 1200))
  })

  it('solves from resistance and power', () => {
    expectStandard(solveElectrical('resistance-power', 12, 1200))
  })

  it('rejects zero, negative, and non-finite known values', () => {
    expect(() => solveElectrical('voltage-current', 0, 10)).toThrow(/greater than zero/i)
    expect(() => solveElectrical('voltage-current', 120, -1)).toThrow(/greater than zero/i)
    expect(() => solveElectrical('voltage-current', Infinity, 10)).toThrow(/finite/i)
  })

  it('rejects unsupported known-value pairs', () => {
    expect(() => solveElectrical('voltage-frequency', 120, 60)).toThrow(/supported pair/i)
  })

  it('rejects results outside the representable range', () => {
    expect(() => solveElectrical('voltage-current', 1e308, 10)).toThrow(/representable range/i)
  })

  it('formats ordinary electrical values cleanly', () => {
    expect(formatElectricalNumber(1200)).toBe('1,200')
    expect(formatElectricalNumber(-0)).toBe('0')
  })
})
