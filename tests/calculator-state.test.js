import { describe, expect, it } from 'vitest'
import fs from 'fs'
import { changeCalculationInput } from '../lib/calculator-state.js'

const calculated = {
  values: { a: '20', b: '150', direction: 'increase' },
  errors: { form: 'Old calculation error', a: 'Field validation remains' },
  answer: { primary: '30' },
}

describe('calculator input state', () => {
  it.each([
    ['first numeric input', 'a', '25'],
    ['second numeric input', 'b', '200'],
    ['increase/decrease operation', 'direction', 'decrease'],
  ])('clears a stale result when the %s changes', (_label, key, value) => {
    const next = changeCalculationInput(calculated, key, value)
    expect(next.values[key]).toBe(value)
    expect(next.answer).toBeNull()
    expect(next.errors).not.toHaveProperty('form')
    expect(next.errors.a).toBe('Field validation remains')
  })

  it('uses ordinary pressed buttons rather than incomplete ARIA tabs', () => {
    const source = fs.readFileSync('components/tooliyapa/PercentageCalculator.jsx', 'utf8')
    expect(source).toContain('type="button" aria-pressed={mode === id}')
    expect(source).toContain('min-h-12')
    expect(source).not.toMatch(/role="tab(list)?"/)
  })
})
