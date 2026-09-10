import { formatCalculatorNumber } from './percentage.js'

function finite(value, label) {
  const number = Number(value)
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be a finite number.`)
  return number
}

export function calculateScorePercentage(earnedInput, possibleInput) {
  const earned = finite(earnedInput, 'Points earned')
  const possible = finite(possibleInput, 'Points possible')
  if (earned < 0) throw new RangeError('Points earned must be zero or greater.')
  if (possible <= 0) throw new RangeError('Points possible must be greater than zero.')
  const percentage = (earned / possible) * 100
  if (!Number.isFinite(percentage)) throw new RangeError('The percentage is too large to represent.')
  return { earned, possible, percentage }
}

export function calculateWeightedGrade(items) {
  if (!Array.isArray(items) || items.length === 0) throw new TypeError('Add at least one graded item.')

  let weightTotal = 0
  let weightedPoints = 0
  const normalizedItems = items.map((item, index) => {
    const score = finite(item.score, `Score ${index + 1}`)
    const weight = finite(item.weight, `Weight ${index + 1}`)
    if (score < 0) throw new RangeError(`Score ${index + 1} must be zero or greater.`)
    if (weight <= 0 || weight > 100) throw new RangeError(`Weight ${index + 1} must be greater than zero and no more than 100.`)
    weightTotal += weight
    weightedPoints += score * (weight / 100)
    return { score, weight }
  })

  if (weightTotal > 100 + 1e-10) throw new RangeError('The combined weights must not exceed 100%.')
  if (!Number.isFinite(weightedPoints)) throw new RangeError('The weighted result is too large to represent.')

  const weightedAverage = weightedPoints / (weightTotal / 100)
  if (!Number.isFinite(weightedAverage)) throw new RangeError('The weighted average is too large to represent.')

  return { items: normalizedItems, weightTotal, weightedPoints, weightedAverage }
}

export function calculateRequiredFinalGrade(currentGradeInput, completedWeightInput, targetGradeInput) {
  const currentGrade = finite(currentGradeInput, 'Current grade')
  const completedWeight = finite(completedWeightInput, 'Completed weight')
  const targetGrade = finite(targetGradeInput, 'Target overall grade')

  if (currentGrade < 0) throw new RangeError('Current grade must be zero or greater.')
  if (targetGrade < 0) throw new RangeError('Target overall grade must be zero or greater.')
  if (completedWeight <= 0 || completedWeight >= 100) throw new RangeError('Completed weight must be greater than 0% and less than 100%.')

  const remainingWeight = 100 - completedWeight
  const completedContribution = currentGrade * (completedWeight / 100)
  const requiredFinalGrade = (targetGrade - completedContribution) / (remainingWeight / 100)

  if (!Number.isFinite(requiredFinalGrade)) throw new RangeError('The required final grade is too large to represent.')

  const status = requiredFinalGrade <= 0
    ? 'target-already-secured'
    : requiredFinalGrade > 100
      ? 'above-100'
      : 'within-100'

  return { currentGrade, completedWeight, targetGrade, remainingWeight, completedContribution, requiredFinalGrade, status }
}

export function formatGradeNumber(value) {
  return formatCalculatorNumber(value)
}
