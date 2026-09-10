function finite(value, name) {
  const number = typeof value === 'number' ? value : Number(String(value).trim())
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be a finite number.`)
  return number
}

export function formatNumber(value, digits = 10) {
  if (!Number.isFinite(value)) throw new RangeError('Result is not a finite number.')
  if (Object.is(value, -0) || value === 0) return '0'
  const absolute = Math.abs(value)
  if (absolute >= 1e12 || absolute < 1e-8) {
    return value.toExponential(Math.min(digits, 10)).replace(/\.0+e/, 'e').replace(/(\.\d*?[1-9])0+e/, '$1e')
  }
  return Number(value.toPrecision(Math.min(15, digits + 4))).toString()
}

function toRadians(value, unit) { return unit === 'deg' ? value * Math.PI / 180 : value }
function fromRadians(value, unit) { return unit === 'deg' ? value * 180 / Math.PI : value }

export function scientificCalculate({ operation, x, y, angleUnit = 'deg' }) {
  const a = finite(x, 'Value')
  const b = y === '' || y === undefined ? null : finite(y, 'Second value')
  let value
  switch (operation) {
    case 'sin': value = Math.sin(toRadians(a, angleUnit)); break
    case 'cos': value = Math.cos(toRadians(a, angleUnit)); break
    case 'tan': value = Math.tan(toRadians(a, angleUnit)); break
    case 'asin':
      if (a < -1 || a > 1) throw new RangeError('Inverse sine requires a value from -1 to 1.')
      value = fromRadians(Math.asin(a), angleUnit); break
    case 'acos':
      if (a < -1 || a > 1) throw new RangeError('Inverse cosine requires a value from -1 to 1.')
      value = fromRadians(Math.acos(a), angleUnit); break
    case 'atan': value = fromRadians(Math.atan(a), angleUnit); break
    case 'sqrt':
      if (a < 0) throw new RangeError('Square root requires a non-negative value.')
      value = Math.sqrt(a); break
    case 'cbrt': value = Math.cbrt(a); break
    case 'ln':
      if (a <= 0) throw new RangeError('Natural logarithm requires a value greater than 0.')
      value = Math.log(a); break
    case 'log10':
      if (a <= 0) throw new RangeError('Base-10 logarithm requires a value greater than 0.')
      value = Math.log10(a); break
    case 'exp': value = Math.exp(a); break
    case 'power':
      if (b === null) throw new TypeError('Enter the exponent.')
      value = a ** b; break
    case 'factorial': {
      if (!Number.isInteger(a) || a < 0 || a > 170) throw new RangeError('Factorial requires a whole number from 0 to 170.')
      value = 1
      for (let i = 2; i <= a; i += 1) value *= i
      break
    }
    case 'reciprocal':
      if (a === 0) throw new RangeError('Reciprocal is undefined for zero.')
      value = 1 / a; break
    case 'abs': value = Math.abs(a); break
    default: throw new RangeError('Choose a supported scientific operation.')
  }
  if (!Number.isFinite(value)) throw new RangeError('That calculation is outside the supported numeric range.')
  return value
}

function parseBigIntToken(value, name = 'Value') {
  const text = String(value).trim()
  if (!/^[+-]?\d+$/.test(text)) throw new TypeError(`${name} must contain whole integers only.`)
  const digits = text.replace(/^[+-]/, '').replace(/^0+/, '') || '0'
  if (digits.length > 100) throw new RangeError(`${name} is too large. Use at most 100 digits per integer.`)
  return BigInt(text)
}

function gcdPair(a, b) {
  a = a < 0n ? -a : a; b = b < 0n ? -b : b
  while (b !== 0n) [a, b] = [b, a % b]
  return a
}

export function parseIntegerList(input) {
  const parts = String(input).trim().split(/[\s,]+/).filter(Boolean)
  if (!parts.length) throw new TypeError('Enter at least one whole integer.')
  if (parts.length > 30) throw new RangeError('Use at most 30 integers at a time.')
  return parts.map((part, index) => parseBigIntToken(part, `Value ${index + 1}`))
}

export function calculateGcdLcm(input) {
  const values = parseIntegerList(input)
  const absolute = values.map((value) => value < 0n ? -value : value)
  let gcd = absolute[0]
  for (const value of absolute.slice(1)) gcd = gcdPair(gcd, value)
  let lcm = absolute[0]
  for (const value of absolute.slice(1)) {
    if (lcm === 0n || value === 0n) lcm = 0n
    else lcm = (lcm / gcdPair(lcm, value)) * value
  }
  return { gcd, lcm, count: values.length }
}

function safeCoefficient(value, name) {
  const number = finite(value, name)
  if (Math.abs(number) > 1e150) throw new RangeError(`${name} is too large for a stable quadratic calculation.`)
  return number
}

export function solveQuadratic(aInput, bInput, cInput) {
  const a = safeCoefficient(aInput, 'a')
  const b = safeCoefficient(bInput, 'b')
  const c = safeCoefficient(cInput, 'c')
  if (a === 0) throw new RangeError('Coefficient a must not be zero for a quadratic equation.')
  const discriminant = b * b - 4 * a * c
  const vertexX = -b / (2 * a)
  const vertexY = a * vertexX * vertexX + b * vertexX + c
  if (![discriminant, vertexX, vertexY].every(Number.isFinite)) throw new RangeError('Those coefficients produce values outside the supported numeric range.')
  if (discriminant >= 0) {
    const sqrt = Math.sqrt(discriminant)
    const root1 = (-b + sqrt) / (2 * a)
    const root2 = (-b - sqrt) / (2 * a)
    return { discriminant, kind: discriminant === 0 ? 'repeated' : 'real', roots: [root1, root2], vertexX, vertexY }
  }
  const real = -b / (2 * a)
  const imaginary = Math.sqrt(-discriminant) / Math.abs(2 * a)
  return { discriminant, kind: 'complex', real, imaginary, vertexX, vertexY }
}

const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export function parseBaseInteger(input, baseInput) {
  const base = Number(baseInput)
  if (![2, 8, 10, 16].includes(base)) throw new RangeError('Choose base 2, 8, 10, or 16.')
  let text = String(input).trim().toUpperCase()
  if (!text) throw new TypeError('Enter an integer.')
  const sign = text.startsWith('-') ? -1n : 1n
  if (/^[+-]/.test(text)) text = text.slice(1)
  if (!text || text.length > 256) throw new RangeError('Use from 1 to 256 digits.')
  let result = 0n
  for (const char of text) {
    const digit = DIGITS.indexOf(char)
    if (digit < 0 || digit >= base) throw new TypeError(`Digit ${char} is not valid in base ${base}.`)
    result = result * BigInt(base) + BigInt(digit)
  }
  return sign * result
}

export function formatBaseInteger(value, baseInput) {
  const base = Number(baseInput)
  if (![2, 8, 10, 16].includes(base)) throw new RangeError('Choose base 2, 8, 10, or 16.')
  return value.toString(base).toUpperCase()
}

export function calculateBaseArithmetic(aInput, bInput, base, operation) {
  const a = parseBaseInteger(aInput, base)
  const b = parseBaseInteger(bInput, base)
  let value
  let remainder = 0n
  switch (operation) {
    case 'add': value = a + b; break
    case 'subtract': value = a - b; break
    case 'multiply': value = a * b; break
    case 'divide':
      if (b === 0n) throw new RangeError('Cannot divide by zero.')
      value = a / b; remainder = a % b; break
    default: throw new RangeError('Choose a supported arithmetic operation.')
  }
  return { value, remainder, formatted: formatBaseInteger(value, base), remainderFormatted: formatBaseInteger(remainder, base) }
}

export function generateRandomNumbers({ min, max, count = 1, integers = true, unique = false, rng = Math.random }) {
  const low = finite(min, 'Minimum')
  const high = finite(max, 'Maximum')
  const quantity = Number(count)
  if (!(high > low)) throw new RangeError('Maximum must be greater than minimum.')
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) throw new RangeError('Count must be a whole number from 1 to 100.')
  if (integers && (!Number.isSafeInteger(low) || !Number.isSafeInteger(high))) throw new RangeError('Integer limits must be safe whole numbers.')
  if (integers && unique && high - low + 1 < quantity) throw new RangeError('The integer range is too small for that many unique results.')
  const output = []
  const seen = new Set()
  let attempts = 0
  while (output.length < quantity) {
    attempts += 1
    if (attempts > 10000) throw new RangeError('Unable to generate enough unique values from this range.')
    const random = rng()
    if (!(random >= 0 && random < 1)) throw new RangeError('Random source must return a value from 0 up to but not including 1.')
    const value = integers ? Math.floor(random * (high - low + 1)) + low : low + random * (high - low)
    const key = integers ? value : value.toPrecision(15)
    if (!unique || !seen.has(key)) { seen.add(key); output.push(value) }
  }
  return output
}
