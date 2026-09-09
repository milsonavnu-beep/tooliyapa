function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`)
}

export const BASIC_OPERATIONS = {
  add: { label: '+', name: 'Addition' },
  subtract: { label: '−', name: 'Subtraction' },
  multiply: { label: '×', name: 'Multiplication' },
  divide: { label: '÷', name: 'Division' },
  power: { label: '^', name: 'Power' },
  modulo: { label: '%', name: 'Remainder' },
}

export function calculateBasic(left, right, operation) {
  finite(left, 'First value'); finite(right, 'Second value')
  if (!BASIC_OPERATIONS[operation]) throw new RangeError('Choose a supported operation.')
  if ((operation === 'divide' || operation === 'modulo') && right === 0) throw new RangeError('The second value must not be zero for this operation.')

  let value
  switch (operation) {
    case 'add': value = left + right; break
    case 'subtract': value = left - right; break
    case 'multiply': value = left * right; break
    case 'divide': value = left / right; break
    case 'power': value = Math.pow(left, right); break
    case 'modulo': value = left % right; break
    default: throw new RangeError('Choose a supported operation.')
  }
  if (!Number.isFinite(value)) throw new RangeError('The calculation produced a non-finite result.')
  return value
}

export function formatBasicNumber(value) {
  finite(value, 'Result')
  if (Object.is(value, -0)) value = 0
  const rounded = Number(value.toPrecision(12))
  const abs = Math.abs(rounded)
  if ((abs > 0 && abs < 1e-9) || abs >= 1e15) return rounded.toExponential().replace('e+', 'e')
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12, maximumFractionDigits: 12 }).format(rounded)
}
