const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function parseIntegerInBase(input, baseInput) {
  const base = Number(baseInput)
  if (![2,8,10,16].includes(base)) throw new RangeError('Choose base 2, 8, 10, or 16.')
  let text = String(input).trim().toUpperCase()
  if (!text) throw new TypeError('Enter an integer to convert.')
  const sign = text.startsWith('-') ? -1n : 1n
  if (/^[+-]/.test(text)) text = text.slice(1)
  if (!text || text.length > 512) throw new RangeError('Use from 1 to 512 digits.')
  let value = 0n
  for (const char of text) {
    const digit = DIGITS.indexOf(char)
    if (digit < 0 || digit >= base) throw new TypeError(`Digit ${char} is not valid in base ${base}.`)
    value = value * BigInt(base) + BigInt(digit)
  }
  return sign * value
}

export function convertBaseNumber(input, fromBase, toBase) {
  const value = parseIntegerInBase(input, fromBase)
  const target = Number(toBase)
  if (![2,8,10,16].includes(target)) throw new RangeError('Choose base 2, 8, 10, or 16.')
  return value.toString(target).toUpperCase()
}

export function encodeText(textInput, format) {
  const text = String(textInput)
  if (text.length > 10000) throw new RangeError('Text is limited to 10,000 characters at a time.')
  const bytes = Array.from(new TextEncoder().encode(text))
  if (format === 'hex') return bytes.map((byte)=>byte.toString(16).padStart(2,'0').toUpperCase()).join(' ')
  if (format === 'binary') return bytes.map((byte)=>byte.toString(2).padStart(8,'0')).join(' ')
  if (format === 'decimal') return bytes.join(' ')
  throw new RangeError('Choose hex, binary, or decimal byte output.')
}

export function decodeText(input, format) {
  const raw = String(input).trim()
  if (!raw) return ''
  let tokens
  if (format === 'hex') {
    const compact = raw.replace(/0x/gi,'').replace(/[^0-9a-f]/gi,'')
    if (!compact || compact.length % 2 !== 0 || compact.length > 60000) throw new TypeError('Hex input must contain complete byte pairs.')
    tokens = compact.match(/.{2}/g).map((token)=>parseInt(token,16))
  } else {
    tokens = raw.split(/[\s,]+/).filter(Boolean)
    if (tokens.length > 30000) throw new RangeError('Byte input is too long.')
    tokens = tokens.map((token)=>{
      if (format === 'binary') {
        if (!/^[01]{1,8}$/.test(token)) throw new TypeError('Binary byte tokens must contain 1 to 8 bits.')
        return parseInt(token,2)
      }
      if (format === 'decimal') {
        if (!/^\d{1,3}$/.test(token)) throw new TypeError('Decimal byte tokens must be whole numbers from 0 to 255.')
        const value = Number(token); if (value > 255) throw new RangeError('Decimal byte values must not exceed 255.'); return value
      }
      throw new RangeError('Choose hex, binary, or decimal byte input.')
    })
  }
  return new TextDecoder('utf-8',{fatal:false}).decode(Uint8Array.from(tokens))
}

const ROMAN_PAIRS = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
export function integerToRoman(input) {
  const number = Number(String(input).trim())
  if (!Number.isInteger(number) || number < 1 || number > 3999) throw new RangeError('Roman numeral conversion supports whole numbers from 1 to 3999.')
  let remaining = number; let output = ''
  for (const [value,symbol] of ROMAN_PAIRS) while (remaining >= value) { output += symbol; remaining -= value }
  return output
}

export function romanToInteger(input) {
  const text = String(input).trim().toUpperCase()
  if (!text || !/^[IVXLCDM]+$/.test(text)) throw new TypeError('Enter Roman numeral letters I, V, X, L, C, D, and M only.')
  const values = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000}
  let total = 0
  for (let i=0;i<text.length;i+=1) total += values[text[i]] < (values[text[i+1]] || 0) ? -values[text[i]] : values[text[i]]
  if (total < 1 || total > 3999 || integerToRoman(total) !== text) throw new RangeError('Enter a canonical Roman numeral from I to MMMCMXCIX.')
  return total
}

function parsePlainDecimal(input) {
  const text = String(input).trim()
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) throw new TypeError('Enter a plain decimal number without an exponent.')
  const sign = text.startsWith('-') ? '-' : ''
  const unsigned = text.replace(/^[+-]/,'')
  const [integerPartRaw, fractionalPart=''] = unsigned.split('.')
  const integerPart = integerPartRaw || '0'
  const combined = integerPart + fractionalPart
  if (combined.length > 500) throw new RangeError('Use at most 500 digits.')
  return { sign, integerPart, fractionalPart, combined }
}

export function decimalToScientific(input) {
  const { sign, integerPart, combined } = parsePlainDecimal(input)
  const first = combined.search(/[1-9]/)
  if (first === -1) return { coefficient: '0', exponent: 0, scientific: '0 × 10^0' }
  const exponent = integerPart.length - first - 1
  let significant = combined.slice(first).replace(/0+$/,'')
  let coefficient = significant[0] + (significant.length > 1 ? `.${significant.slice(1)}` : '')
  coefficient = `${sign}${coefficient}`
  return { coefficient, exponent, scientific: `${coefficient} × 10^${exponent}` }
}

export function scientificToDecimal(coefficientInput, exponentInput) {
  const coefficient = parsePlainDecimal(coefficientInput)
  const exponent = Number(String(exponentInput).trim())
  if (!Number.isInteger(exponent) || Math.abs(exponent) > 500) throw new RangeError('Exponent must be a whole number from -500 to 500.')
  const normalized = decimalToScientific(`${coefficient.sign}${coefficient.integerPart}${coefficient.fractionalPart ? `.${coefficient.fractionalPart}` : ''}`)
  if (normalized.coefficient === '0') return '0'
  const totalExponent = normalized.exponent + exponent
  if (Math.abs(totalExponent) > 1000) throw new RangeError('The expanded decimal would be too long to display safely.')
  const sign = normalized.coefficient.startsWith('-') ? '-' : ''
  const digits = normalized.coefficient.replace('-','').replace('.','')
  const decimalIndex = 1 + totalExponent
  if (decimalIndex <= 0) return `${sign}0.${'0'.repeat(-decimalIndex)}${digits}`
  if (decimalIndex >= digits.length) return `${sign}${digits}${'0'.repeat(decimalIndex-digits.length)}`
  return `${sign}${digits.slice(0,decimalIndex)}.${digits.slice(decimalIndex)}`
}

const MORSE = {
  A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.', '.':'.-.-.-', ',':'--..--', '?':'..--..', '!':'-.-.--', '/':'-..-.', '(':'-.--.', ')':'-.--.-', ':':'---...', ';':'-.-.-.', '=':'-...-', '+':'.-.-.', '-':'-....-', '_':'..--.-', '"':'.-..-.', '$':'...-..-', '@':'.--.-.'
}
const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE).map(([key,value])=>[value,key]))

export function textToMorse(input) {
  const text = String(input).toUpperCase()
  if (text.length > 5000) throw new RangeError('Text is limited to 5,000 characters.')
  return text.split('').map((char)=>char === ' ' ? '/' : MORSE[char] || '?').join(' ')
}

export function morseToText(input) {
  const text = String(input).trim()
  if (text.length > 30000) throw new RangeError('Morse input is too long.')
  if (!text) return ''
  return text.split(/\s+/).map((token)=>token === '/' ? ' ' : MORSE_REVERSE[token] || '�').join('').replace(/\s+/g,' ').trim()
}
