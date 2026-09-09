import { describe, expect, it } from 'vitest'
import { calculateStatistics, formatStatistic, parseStatisticsInput } from '../lib/statistics.js'

describe('statistics calculator', () => {
  it('parses comma, space, and newline separated values', () => {
    expect(parseStatisticsInput('1, 2\n3 4')).toEqual([1, 2, 3, 4])
    expect(() => parseStatisticsInput('')).toThrow(/at least one/)
    expect(() => parseStatisticsInput('1 nope')).toThrow(/finite number/)
  })

  it('calculates central tendency and spread', () => {
    const result = calculateStatistics([1, 2, 2, 5])
    expect(result.count).toBe(4)
    expect(result.sum).toBe(10)
    expect(result.mean).toBe(2.5)
    expect(result.median).toBe(2)
    expect(result.modes).toEqual([2])
    expect(result.range).toBe(4)
    expect(result.populationVariance).toBeCloseTo(2.25)
    expect(result.populationStandardDeviation).toBeCloseTo(1.5)
    expect(result.sampleVariance).toBeCloseTo(3)
  })

  it('handles mode and one-value sample rules', () => {
    expect(calculateStatistics([1, 2, 3]).modes).toEqual([])
    const single = calculateStatistics([7])
    expect(single.sampleVariance).toBeNull()
    expect(single.sampleStandardDeviation).toBeNull()
  })

  it('calculates geometric and harmonic means only for positive data', () => {
    const result = calculateStatistics([1, 4])
    expect(result.geometricMean).toBeCloseTo(2)
    expect(result.harmonicMean).toBeCloseTo(1.6)
    expect(calculateStatistics([-1, 4]).geometricMean).toBeNull()
  })

  it('formats results readably', () => {
    expect(formatStatistic(0.1 + 0.2)).toBe('0.3')
    expect(formatStatistic(null)).toBe('Not defined')
  })
})
