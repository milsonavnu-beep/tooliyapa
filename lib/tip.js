function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`)
}

function safe(value) {
  if (!Number.isFinite(value)) throw new RangeError('The calculation produced a non-finite result.')
  return value
}

export function calculateTip(billAmount, tipPercent, people = 1) {
  finite(billAmount, 'Bill amount'); finite(tipPercent, 'Tip percentage'); finite(people, 'People')
  if (billAmount <= 0) throw new RangeError('Bill amount must be greater than zero.')
  if (tipPercent < 0) throw new RangeError('Tip percentage must be zero or greater.')
  if (!Number.isInteger(people) || people < 1 || people > 10000) throw new RangeError('People must be a whole number from 1 to 10,000.')
  const tipAmount = safe(billAmount * (tipPercent / 100))
  const totalAmount = safe(billAmount + tipAmount)
  return {
    billAmount,
    tipPercent,
    people,
    tipAmount,
    totalAmount,
    tipPerPerson: safe(tipAmount / people),
    totalPerPerson: safe(totalAmount / people),
  }
}

export function formatTipNumber(value) {
  finite(value, 'Result')
  if (Object.is(value, -0)) value = 0
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(value)
}
