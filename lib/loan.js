function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`)
}

function finiteResult(value) {
  if (!Number.isFinite(value)) throw new RangeError('The calculation produced a non-finite result.')
  return value
}

function validateLoanInputs(principal, annualRatePercent, termMonths) {
  finite(principal, 'Loan amount')
  finite(annualRatePercent, 'Annual interest rate')
  finite(termMonths, 'Loan term')
  if (principal <= 0) throw new RangeError('The loan amount must be greater than zero.')
  if (annualRatePercent < 0) throw new RangeError('The annual interest rate must be zero or greater.')
  if (!Number.isInteger(termMonths) || termMonths < 1 || termMonths > 1200) {
    throw new RangeError('The loan term must be a whole number of months from 1 to 1200.')
  }
}

export function calculateLoanPayment(principal, annualRatePercent, termMonths) {
  validateLoanInputs(principal, annualRatePercent, termMonths)
  if (annualRatePercent === 0) return finiteResult(principal / termMonths)

  const monthlyRate = annualRatePercent / 1200
  const denominator = -Math.expm1(-termMonths * Math.log1p(monthlyRate))
  return finiteResult(principal * monthlyRate / denominator)
}

function simulateRepayment(principal, monthlyRate, termMonths, scheduledPayment) {
  let balance = principal
  let totalInterest = 0
  let totalPayment = 0
  let payoffMonths = 0
  let lastPayment = 0

  for (let month = 1; month <= termMonths && balance > 0; month += 1) {
    const interest = finiteResult(balance * monthlyRate)
    const amountAvailableForPrincipal = scheduledPayment - interest
    let payment
    let principalPaid

    if (month === termMonths || amountAvailableForPrincipal >= balance) {
      principalPaid = balance
      payment = finiteResult(balance + interest)
    } else {
      if (amountAvailableForPrincipal <= 0) throw new RangeError('The payment is not sufficient to reduce the loan balance.')
      principalPaid = amountAvailableForPrincipal
      payment = scheduledPayment
    }

    balance = finiteResult(balance - principalPaid)
    totalInterest = finiteResult(totalInterest + interest)
    totalPayment = finiteResult(totalPayment + payment)
    payoffMonths = month
    lastPayment = payment
  }

  return { payoffMonths, totalInterest, totalPayment, lastPayment }
}

export function calculateLoanSummary(principal, annualRatePercent, termMonths, extraMonthlyPayment = 0) {
  validateLoanInputs(principal, annualRatePercent, termMonths)
  finite(extraMonthlyPayment, 'Extra monthly payment')
  if (extraMonthlyPayment < 0) throw new RangeError('The extra monthly payment must be zero or greater.')

  const scheduledMonthlyPayment = calculateLoanPayment(principal, annualRatePercent, termMonths)
  const monthlyRate = annualRatePercent / 1200
  const plannedMonthlyPayment = finiteResult(scheduledMonthlyPayment + extraMonthlyPayment)
  const actual = simulateRepayment(principal, monthlyRate, termMonths, plannedMonthlyPayment)
  const baseline = extraMonthlyPayment > 0
    ? simulateRepayment(principal, monthlyRate, termMonths, scheduledMonthlyPayment)
    : actual

  return {
    principal,
    annualRatePercent,
    termMonths,
    extraMonthlyPayment,
    scheduledMonthlyPayment,
    plannedMonthlyPayment,
    payoffMonths: actual.payoffMonths,
    totalInterest: actual.totalInterest,
    totalPayment: actual.totalPayment,
    lastPayment: actual.lastPayment,
    monthsSaved: Math.max(0, termMonths - actual.payoffMonths),
    interestSaved: finiteResult(Math.max(0, baseline.totalInterest - actual.totalInterest)),
  }
}

export function formatLoanAmount(value) {
  finite(value, 'Amount')
  const normalized = Object.is(value, -0) ? 0 : value
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(normalized)
}

export function formatLoanDuration(months) {
  finite(months, 'Months')
  if (!Number.isInteger(months) || months < 0) throw new RangeError('Months must be a non-negative whole number.')
  const years = Math.floor(months / 12)
  const remainder = months % 12
  const parts = []
  if (years) parts.push(`${years} year${years === 1 ? '' : 's'}`)
  if (remainder) parts.push(`${remainder} month${remainder === 1 ? '' : 's'}`)
  return parts.length ? parts.join(' ') : '0 months'
}
