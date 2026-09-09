function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`)
}

export function parseStatisticsInput(text) {
  if (typeof text !== 'string' || text.trim() === '') throw new RangeError('Enter at least one number.')
  const tokens = text.trim().split(/[\s,]+/).filter(Boolean)
  if (tokens.length > 10000) throw new RangeError('Use no more than 10,000 values at a time.')
  const values = tokens.map((token) => {
    const value = Number(token)
    finite(value, `Value ${token}`)
    return Object.is(value, -0) ? 0 : value
  })
  return values
}

function kahanSum(values) {
  let sum = 0
  let correction = 0
  for (const value of values) {
    const adjusted = value - correction
    const next = sum + adjusted
    correction = (next - sum) - adjusted
    sum = next
  }
  return sum
}

export function calculateStatistics(values) {
  if (!Array.isArray(values) || values.length === 0) throw new RangeError('Provide at least one value.')
  values.forEach((value, index) => finite(value, `Value ${index + 1}`))
  const count = values.length
  const sum = kahanSum(values)
  if (!Number.isFinite(sum)) throw new RangeError('The dataset sum is too large to represent.')
  const mean = sum / count
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(count / 2)
  const median = count % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  const min = sorted[0]
  const max = sorted[count - 1]
  const range = max - min

  const frequencies = new Map()
  for (const value of values) frequencies.set(value, (frequencies.get(value) || 0) + 1)
  const maxFrequency = Math.max(...frequencies.values())
  const modes = maxFrequency <= 1 ? [] : [...frequencies.entries()].filter(([, frequency]) => frequency === maxFrequency).map(([value]) => value).sort((a, b) => a - b)

  let runningMean = 0
  let m2 = 0
  let n = 0
  for (const value of values) {
    n += 1
    const delta = value - runningMean
    runningMean += delta / n
    const delta2 = value - runningMean
    m2 += delta * delta2
  }
  const populationVariance = Math.max(0, m2 / count)
  const sampleVariance = count > 1 ? Math.max(0, m2 / (count - 1)) : null
  const populationStandardDeviation = Math.sqrt(populationVariance)
  const sampleStandardDeviation = sampleVariance === null ? null : Math.sqrt(sampleVariance)

  let geometricMean = null
  let harmonicMean = null
  if (values.every((value) => value > 0)) {
    const logMean = kahanSum(values.map(Math.log)) / count
    const geometric = Math.exp(logMean)
    geometricMean = Number.isFinite(geometric) ? geometric : null
    const reciprocalSum = kahanSum(values.map((value) => 1 / value))
    const harmonic = count / reciprocalSum
    harmonicMean = Number.isFinite(harmonic) ? harmonic : null
  }

  return { count, sum, mean, median, modes, modeFrequency: maxFrequency, min, max, range, populationVariance, sampleVariance, populationStandardDeviation, sampleStandardDeviation, geometricMean, harmonicMean }
}

export function formatStatistic(value) {
  if (value === null) return 'Not defined'
  finite(value, 'Result')
  if (Object.is(value, -0)) value = 0
  const rounded = Number(value.toPrecision(12))
  const abs = Math.abs(rounded)
  if ((abs > 0 && abs < 1e-9) || abs >= 1e15) return rounded.toExponential().replace('e+', 'e')
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12, maximumFractionDigits: 10 }).format(rounded)
}
