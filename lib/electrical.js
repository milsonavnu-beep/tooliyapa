import { formatCalculatorNumber } from './percentage.js'

function positive(value, label) {
  const number = Number(value)
  if (!Number.isFinite(number)) throw new TypeError(`${label} must be a finite number.`)
  if (number <= 0) throw new RangeError(`${label} must be greater than zero.`)
  return number
}

function checkedResult(voltage, current, resistance, power, formula) {
  const values = { voltage, current, resistance, power }
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value <= 0) throw new RangeError(`The calculated ${key} is outside the representable range.`)
  }
  return { ...values, formula }
}

export function solveElectrical(pair, firstInput, secondInput) {
  switch (pair) {
    case 'voltage-current': {
      const voltage = positive(firstInput, 'Voltage')
      const current = positive(secondInput, 'Current')
      return checkedResult(voltage, current, voltage / current, voltage * current, 'R = V ÷ I; P = V × I')
    }
    case 'voltage-resistance': {
      const voltage = positive(firstInput, 'Voltage')
      const resistance = positive(secondInput, 'Resistance')
      const current = voltage / resistance
      return checkedResult(voltage, current, resistance, voltage * current, 'I = V ÷ R; P = V × I')
    }
    case 'voltage-power': {
      const voltage = positive(firstInput, 'Voltage')
      const power = positive(secondInput, 'Power')
      const current = power / voltage
      return checkedResult(voltage, current, voltage / current, power, 'I = P ÷ V; R = V ÷ I')
    }
    case 'current-resistance': {
      const current = positive(firstInput, 'Current')
      const resistance = positive(secondInput, 'Resistance')
      const voltage = current * resistance
      return checkedResult(voltage, current, resistance, voltage * current, 'V = I × R; P = V × I')
    }
    case 'current-power': {
      const current = positive(firstInput, 'Current')
      const power = positive(secondInput, 'Power')
      const voltage = power / current
      return checkedResult(voltage, current, voltage / current, power, 'V = P ÷ I; R = V ÷ I')
    }
    case 'resistance-power': {
      const resistance = positive(firstInput, 'Resistance')
      const power = positive(secondInput, 'Power')
      const current = Math.sqrt(power / resistance)
      const voltage = current * resistance
      return checkedResult(voltage, current, resistance, power, 'I = √(P ÷ R); V = I × R')
    }
    default:
      throw new RangeError('Choose a supported pair of known electrical values.')
  }
}

export function formatElectricalNumber(value) {
  return formatCalculatorNumber(value)
}
