import { describe, expect, it } from 'vitest'
import { calculateRequiredFinalGrade, calculateScorePercentage, calculateWeightedGrade, formatGradeNumber } from '../lib/grade.js'

describe('Grade Calculator math', () => {
  it('converts earned marks to a percentage', () => {
    expect(calculateScorePercentage(45, 50).percentage).toBeCloseTo(90, 12)
    expect(calculateScorePercentage(55, 50).percentage).toBeCloseTo(110, 12)
  })

  it('validates mark inputs', () => {
    expect(() => calculateScorePercentage(-1, 50)).toThrow(/zero or greater/i)
    expect(() => calculateScorePercentage(10, 0)).toThrow(/greater than zero/i)
    expect(() => calculateScorePercentage(Infinity, 50)).toThrow(/finite/i)
  })

  it('calculates a complete weighted grade', () => {
    const result = calculateWeightedGrade([
      { score: 80, weight: 40 },
      { score: 90, weight: 60 },
    ])
    expect(result.weightTotal).toBeCloseTo(100, 12)
    expect(result.weightedPoints).toBeCloseTo(86, 12)
    expect(result.weightedAverage).toBeCloseTo(86, 12)
  })

  it('normalizes a partial weighted set while retaining its course contribution', () => {
    const result = calculateWeightedGrade([
      { score: 80, weight: 20 },
      { score: 100, weight: 30 },
    ])
    expect(result.weightTotal).toBeCloseTo(50, 12)
    expect(result.weightedPoints).toBeCloseTo(46, 12)
    expect(result.weightedAverage).toBeCloseTo(92, 12)
  })

  it('rejects invalid weighted-grade data', () => {
    expect(() => calculateWeightedGrade([])).toThrow(/at least one/i)
    expect(() => calculateWeightedGrade([{ score: -1, weight: 10 }])).toThrow(/zero or greater/i)
    expect(() => calculateWeightedGrade([{ score: 80, weight: 0 }])).toThrow(/greater than zero/i)
    expect(() => calculateWeightedGrade([{ score: 80, weight: 60 }, { score: 90, weight: 50 }])).toThrow(/exceed 100/i)
  })

  it('calculates the average required on remaining course weight', () => {
    const result = calculateRequiredFinalGrade(80, 60, 85)
    expect(result.remainingWeight).toBeCloseTo(40, 12)
    expect(result.requiredFinalGrade).toBeCloseTo(92.5, 12)
    expect(result.status).toBe('within-100')
  })

  it('identifies targets already secured', () => {
    const result = calculateRequiredFinalGrade(100, 80, 70)
    expect(result.requiredFinalGrade).toBeCloseTo(-50, 12)
    expect(result.status).toBe('target-already-secured')
  })

  it('identifies mathematically required grades above 100%', () => {
    const result = calculateRequiredFinalGrade(70, 80, 90)
    expect(result.requiredFinalGrade).toBeCloseTo(170, 12)
    expect(result.status).toBe('above-100')
  })

  it('validates final-grade assumptions', () => {
    expect(() => calculateRequiredFinalGrade(80, 0, 90)).toThrow(/greater than 0/i)
    expect(() => calculateRequiredFinalGrade(80, 100, 90)).toThrow(/less than 100/i)
    expect(() => calculateRequiredFinalGrade(-1, 50, 90)).toThrow(/zero or greater/i)
    expect(() => calculateRequiredFinalGrade(80, 50, NaN)).toThrow(/finite/i)
  })

  it('formats readable grade results', () => {
    expect(formatGradeNumber(92.5)).toBe('92.5')
    expect(formatGradeNumber(-0)).toBe('0')
  })
})
