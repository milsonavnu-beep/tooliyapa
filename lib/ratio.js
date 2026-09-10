import { fractionToDecimalString, fractionToString, normalizeFraction } from './fraction.js'
import { formatCalculatorNumber } from './percentage.js'

function integerTerm(value, label) {
  try {
    return normalizeFraction(value, 1).numerator
  } catch (error) {
    throw new error.constructor(error.message.replace('Numerator', label))
  }
}

export function simplifyRatio(leftInput, rightInput) {
  const fraction = normalizeFraction(leftInput, rightInput)
  return { left: fraction.numerator, right: fraction.denominator }
}

export function solveProportion(aInput, bInput, cInput) {
  const first = normalizeFraction(aInput, bInput)
  const c = integerTerm(cInput, 'Third term')
  if (first.numerator === 0n) throw new RangeError('The first ratio term must not be zero when solving for x.')
  if (c === 0n) throw new RangeError('The third ratio term must not be zero when solving this proportion.')
  return normalizeFraction(first.denominator * c, first.numerator)
}

export function splitTotalByRatio(totalInput, leftInput, rightInput) {
  const total = Number(totalInput)
  if (!Number.isFinite(total)) throw new TypeError('Total must be a finite number.')
  if (total < 0) throw new RangeError('Total must be zero or greater.')

  const left = integerTerm(leftInput, 'First ratio term')
  const right = integerTerm(rightInput, 'Second ratio term')
  if (left <= 0n || right <= 0n) throw new RangeError('Ratio terms must be positive whole integers when splitting a total.')

  const leftNumber = Number(left)
  const rightNumber = Number(right)
  const share = leftNumber / (leftNumber + rightNumber)
  const firstShare = total * share
  const secondShare = total - firstShare
  if (!Number.isFinite(firstShare) || !Number.isFinite(secondShare)) throw new RangeError('The split result is too large to represent.')

  return { firstShare, secondShare, total, left, right }
}

export function formatRatio(left, right) {
  return `${left.toString()} : ${right.toString()}`
}

export function formatProportionResult(result) {
  return result.denominator === 1n ? result.numerator.toString() : fractionToString(result)
}

export function proportionDecimal(result) {
  return fractionToDecimalString(result, 12)
}

export function formatRatioNumber(value) {
  return formatCalculatorNumber(value)
}
