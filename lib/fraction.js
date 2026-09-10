function parseInteger(value, name) {
  const text = typeof value === 'bigint' ? value.toString() : String(value).trim()
  if (!/^[+-]?\d+$/.test(text)) throw new TypeError(`${name} must be a whole integer.`)
  const digits = text.replace(/^[+-]/, '').replace(/^0+/, '') || '0'
  if (digits.length > 100) throw new RangeError(`${name} is too large. Use at most 100 digits.`)
  return BigInt(text)
}

function absBigInt(value) { return value < 0n ? -value : value }

export function gcdBigInt(a, b) {
  a = absBigInt(a); b = absBigInt(b)
  while (b !== 0n) [a, b] = [b, a % b]
  return a
}

export function normalizeFraction(numeratorInput, denominatorInput) {
  let numerator = parseInteger(numeratorInput, 'Numerator')
  let denominator = parseInteger(denominatorInput, 'Denominator')
  if (denominator === 0n) throw new RangeError('Denominator must not be zero.')
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator }
  const divisor = gcdBigInt(numerator, denominator)
  return { numerator: numerator / divisor, denominator: denominator / divisor }
}

export function calculateFraction(aNumerator, aDenominator, bNumerator, bDenominator, operation) {
  const a = normalizeFraction(aNumerator, aDenominator)
  const b = normalizeFraction(bNumerator, bDenominator)
  let numerator
  let denominator
  switch (operation) {
    case 'add': numerator = a.numerator * b.denominator + b.numerator * a.denominator; denominator = a.denominator * b.denominator; break
    case 'subtract': numerator = a.numerator * b.denominator - b.numerator * a.denominator; denominator = a.denominator * b.denominator; break
    case 'multiply': numerator = a.numerator * b.numerator; denominator = a.denominator * b.denominator; break
    case 'divide':
      if (b.numerator === 0n) throw new RangeError('Cannot divide by a zero fraction.')
      numerator = a.numerator * b.denominator; denominator = a.denominator * b.numerator; break
    default: throw new RangeError('Choose a supported fraction operation.')
  }
  return normalizeFraction(numerator, denominator)
}

export function fractionToString(fraction) {
  return `${fraction.numerator.toString()}/${fraction.denominator.toString()}`
}

export function fractionToMixedString(fraction) {
  const { numerator, denominator } = normalizeFraction(fraction.numerator, fraction.denominator)
  const sign = numerator < 0n ? '-' : ''
  const absolute = absBigInt(numerator)
  const whole = absolute / denominator
  const remainder = absolute % denominator
  if (remainder === 0n) return `${sign}${whole}`
  if (whole === 0n) return `${sign}${remainder}/${denominator}`
  return `${sign}${whole} ${remainder}/${denominator}`
}

export function fractionToDecimalString(fraction, places = 12) {
  if (!Number.isInteger(places) || places < 0 || places > 30) throw new RangeError('Decimal places must be from 0 to 30.')
  const { numerator, denominator } = normalizeFraction(fraction.numerator, fraction.denominator)
  const sign = numerator < 0n ? '-' : ''
  let absolute = absBigInt(numerator)
  const whole = absolute / denominator
  let remainder = absolute % denominator
  if (places === 0 || remainder === 0n) return `${sign}${whole}`
  let decimals = ''
  for (let i = 0; i < places && remainder !== 0n; i += 1) {
    remainder *= 10n
    decimals += (remainder / denominator).toString()
    remainder %= denominator
  }
  decimals = decimals.replace(/0+$/, '')
  const suffix = remainder !== 0n ? '…' : ''
  return decimals ? `${sign}${whole}.${decimals}${suffix}` : `${sign}${whole}`
}

export function fractionToPercentString(fraction, places = 10) {
  return `${fractionToDecimalString({ numerator: fraction.numerator * 100n, denominator: fraction.denominator }, places)}%`
}
