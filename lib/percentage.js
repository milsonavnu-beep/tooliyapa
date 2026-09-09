function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`)
}

function result(value) {
  if (!Number.isFinite(value)) throw new RangeError('The calculation produced a non-finite result.')
  return value
}

export function calculatePercentOf(percent, value) {
  finite(percent, 'Percentage'); finite(value, 'Value')
  // Scale the larger operand before multiplying. This avoids overflowing the
  // product (value * percent) and avoids underflowing a tiny operand / 100.
  const calculated = Math.abs(value) >= Math.abs(percent)
    ? (value / 100) * percent
    : value * (percent / 100)
  return result(calculated)
}

export function calculateWhatPercent(part, whole) {
  finite(part, 'Part'); finite(whole, 'Whole')
  if (whole === 0) throw new RangeError('The whole value must not be zero.')
  // Multiplying first preserves subnormal ratios when it is safe; dividing
  // first avoids overflowing a large numerator.
  const calculated = Math.abs(part) <= Number.MAX_VALUE / 100
    ? (part * 100) / whole
    : (part / whole) * 100
  return result(calculated)
}

export function calculatePercentageChange(oldValue, newValue) {
  finite(oldValue, 'Starting value'); finite(newValue, 'New value')
  if (oldValue <= 0) throw new RangeError('The starting value must be greater than zero.')
  // Dividing first avoids overflowing newValue - oldValue for finite values
  // with opposite signs, such as 1e308 changing to -1e308.
  return result((newValue / oldValue - 1) * 100)
}

export function applyPercentageChange(value, percent, direction) {
  finite(value, 'Base value'); finite(percent, 'Percentage')
  if (percent < 0) throw new RangeError('The percentage must be zero or greater.')
  if (!['increase', 'decrease'].includes(direction)) throw new RangeError('Direction must be increase or decrease.')
  return result(value * (direction === 'increase' ? 1 + percent / 100 : 1 - percent / 100))
}

export function formatCalculatorNumber(value) {
  finite(value, 'Result')
  const normalized = Object.is(value, -0) ? 0 : value
  if (normalized === 0) return '0'

  const rounded = Number(normalized.toPrecision(12))
  const magnitude = Math.abs(rounded)

  // Keep everyday values readable, but avoid rounding tiny non-zero results to
  // "0" or expanding extreme finite values into unwieldy decimal strings.
  if (magnitude < 1e-7 || magnitude >= 1e21) {
    return rounded
      .toExponential(11)
      .replace(/(\.\d*?[1-9])0+e/, '$1e')
      .replace(/\.0+e/, 'e')
  }

  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12, maximumFractionDigits: 15, useGrouping: true }).format(rounded)
}
