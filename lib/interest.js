function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`)
}

function result(value) {
  if (!Number.isFinite(value)) throw new RangeError('The calculation produced a non-finite result.')
  return value
}

export function calculateSimpleInterest(principal, annualRatePercent, years) {
  finite(principal, 'Principal'); finite(annualRatePercent, 'Annual rate'); finite(years, 'Years')
  if (principal < 0) throw new RangeError('Principal must be zero or greater.')
  if (annualRatePercent < 0) throw new RangeError('Annual rate must be zero or greater.')
  if (years <= 0) throw new RangeError('Years must be greater than zero.')
  const interest = result(principal * (annualRatePercent / 100) * years)
  return { interest, finalAmount: result(principal + interest) }
}

export function calculateCompoundInterest({ principal, annualRatePercent, years, compoundsPerYear, contributionPerPeriod = 0 }) {
  finite(principal, 'Principal'); finite(annualRatePercent, 'Annual rate'); finite(years, 'Years'); finite(compoundsPerYear, 'Compounds per year'); finite(contributionPerPeriod, 'Contribution')
  if (principal < 0) throw new RangeError('Principal must be zero or greater.')
  if (annualRatePercent < 0) throw new RangeError('Annual rate must be zero or greater.')
  if (years <= 0) throw new RangeError('Years must be greater than zero.')
  if (!Number.isInteger(compoundsPerYear) || compoundsPerYear < 1 || compoundsPerYear > 365) throw new RangeError('Compounds per year must be a whole number from 1 to 365.')
  if (contributionPerPeriod < 0) throw new RangeError('Contribution must be zero or greater.')

  const periods = compoundsPerYear * years
  if (!Number.isInteger(periods) || periods < 1 || periods > 100000) throw new RangeError('The term must contain a whole number of compounding periods and no more than 100,000 periods.')
  if (principal === 0 && contributionPerPeriod === 0) return { finalAmount: 0, interestEarned: 0, totalContributions: 0, apyPercent: calculateAPY(annualRatePercent, compoundsPerYear), periods }

  const periodicRate = annualRatePercent / 100 / compoundsPerYear
  const growth = periodicRate === 0 ? 1 : result(Math.pow(1 + periodicRate, periods))
  const principalFuture = result(principal * growth)
  const contributionFuture = periodicRate === 0
    ? result(contributionPerPeriod * periods)
    : result(contributionPerPeriod * ((growth - 1) / periodicRate))
  const totalContributions = result(principal + contributionPerPeriod * periods)
  const finalAmount = result(principalFuture + contributionFuture)
  return {
    finalAmount,
    totalContributions,
    interestEarned: result(finalAmount - totalContributions),
    apyPercent: calculateAPY(annualRatePercent, compoundsPerYear),
    periods,
  }
}

export function calculateAPY(annualRatePercent, compoundsPerYear) {
  finite(annualRatePercent, 'Annual rate'); finite(compoundsPerYear, 'Compounds per year')
  if (annualRatePercent < 0) throw new RangeError('Annual rate must be zero or greater.')
  if (!Number.isInteger(compoundsPerYear) || compoundsPerYear < 1 || compoundsPerYear > 365) throw new RangeError('Compounds per year must be a whole number from 1 to 365.')
  const periodicRate = annualRatePercent / 100 / compoundsPerYear
  return result((Math.pow(1 + periodicRate, compoundsPerYear) - 1) * 100)
}

export function formatInterestNumber(value) {
  finite(value, 'Result')
  if (Object.is(value, -0)) value = 0
  const abs = Math.abs(value)
  if ((abs > 0 && abs < 1e-9) || abs >= 1e15) return Number(value.toPrecision(10)).toExponential().replace('e+', 'e')
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12, maximumFractionDigits: 8 }).format(value)
}
