function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`)
}

function result(value) {
  if (!Number.isFinite(value)) throw new RangeError('The calculation produced a non-finite result.')
  return value
}

export function calculatePercentOf(percent, value) {
  finite(percent, 'Percentage'); finite(value, 'Value')
  return result(value * percent / 100)
}

export function calculateWhatPercent(part, whole) {
  finite(part, 'Part'); finite(whole, 'Whole')
  if (whole === 0) throw new RangeError('The whole value must not be zero.')
  return result(part / whole * 100)
}

export function calculatePercentageChange(oldValue, newValue) {
  finite(oldValue, 'Starting value'); finite(newValue, 'New value')
  if (oldValue <= 0) throw new RangeError('The starting value must be greater than zero.')
  return result((newValue - oldValue) / oldValue * 100)
}

export function applyPercentageChange(value, percent, direction) {
  finite(value, 'Base value'); finite(percent, 'Percentage')
  if (percent < 0) throw new RangeError('The percentage must be zero or greater.')
  if (!['increase', 'decrease'].includes(direction)) throw new RangeError('Direction must be increase or decrease.')
  return result(value * (direction === 'increase' ? 1 + percent / 100 : 1 - percent / 100))
}

export function formatCalculatorNumber(value) {
  finite(value, 'Result')
  const rounded = Object.is(value, -0) ? 0 : Number(value.toPrecision(12))
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12, maximumFractionDigits: 15, useGrouping: true }).format(rounded)
}

