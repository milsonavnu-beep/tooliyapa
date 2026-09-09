'use client'

import { useState } from 'react'
import { CalculatorField } from './CalculatorUI'
import { changeCalculationInput } from '@/lib/calculator-state'
import { calculateLoanSummary, formatLoanAmount, formatLoanDuration } from '@/lib/loan'

const INITIAL = { principal: '', rate: '', months: '', extra: '' }

function parseRequired(value) {
  if (value.trim() === '') throw new Error('Enter a value.')
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error('Enter a finite number.')
  return number
}

function parseOptional(value) {
  if (value.trim() === '') return 0
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error('Enter a finite number.')
  return number
}

export default function LoanCalculator() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [answer, setAnswer] = useState(null)

  const update = (key) => (event) => {
    const next = changeCalculationInput({ values, errors, answer }, key, event.target.value)
    setValues(next.values)
    setErrors(next.errors)
    setAnswer(next.answer)
  }

  function calculate(event) {
    event.preventDefault()
    const nextErrors = {}
    let principal
    let rate
    let months
    let extra

    try { principal = parseRequired(values.principal) } catch (error) { nextErrors.principal = error.message }
    try { rate = parseRequired(values.rate) } catch (error) { nextErrors.rate = error.message }
    try { months = parseRequired(values.months) } catch (error) { nextErrors.months = error.message }
    try { extra = parseOptional(values.extra) } catch (error) { nextErrors.extra = error.message }

    if (Number.isFinite(principal) && principal <= 0) nextErrors.principal = 'Enter a loan amount greater than zero.'
    if (Number.isFinite(rate) && rate < 0) nextErrors.rate = 'Use an annual interest rate of zero or greater.'
    if (Number.isFinite(months) && (!Number.isInteger(months) || months < 1 || months > 1200)) nextErrors.months = 'Use a whole number of months from 1 to 1200.'
    if (Number.isFinite(extra) && extra < 0) nextErrors.extra = 'Use an extra monthly payment of zero or greater.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setAnswer(null); return }

    try {
      setAnswer(calculateLoanSummary(principal, rate, months, extra))
    } catch (error) {
      setAnswer(null)
      setErrors({ form: error.message })
    }
  }

  const reset = () => {
    setValues(INITIAL)
    setErrors({})
    setAnswer(null)
  }

  return <div className="mt-9 grid min-w-0 gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <form onSubmit={calculate} className="space-y-5" noValidate>
        <CalculatorField id="loan-principal" label="Loan amount" value={values.principal} onChange={update('principal')} error={errors.principal} hint="Enter the amount borrowed. Results use the same currency as this value." />
        <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorField id="loan-rate" label="Annual interest rate (%)" value={values.rate} onChange={update('rate')} error={errors.rate} hint="Nominal annual rate. A 0% loan is supported." />
          <CalculatorField id="loan-months" label="Loan term (months)" value={values.months} onChange={update('months')} error={errors.months} hint="Whole months only. Example: 60 months = 5 years." />
        </div>
        <CalculatorField id="loan-extra" label="Extra monthly payment (optional)" value={values.extra} onChange={update('extra')} error={errors.extra} hint="Assumed to be paid every month in addition to the scheduled payment." />
        {errors.form && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{errors.form}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">Calculate loan</button>
          <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Reset</button>
        </div>
      </form>
    </div>

    <section aria-live="polite" aria-atomic="true" className="min-w-0 rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Estimated repayment</p>
      {!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter loan details to calculate</p> : <>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Scheduled monthly payment</p>
        <p className="mt-1 break-words text-3xl font-bold text-slate-900 dark:text-white">{formatLoanAmount(answer.scheduledMonthlyPayment)}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {answer.extraMonthlyPayment > 0 && <ResultItem label="Planned monthly outflow" value={formatLoanAmount(answer.plannedMonthlyPayment)} />}
          <ResultItem label="Total interest" value={formatLoanAmount(answer.totalInterest)} />
          <ResultItem label="Total amount paid" value={formatLoanAmount(answer.totalPayment)} />
          <ResultItem label="Estimated payoff" value={formatLoanDuration(answer.payoffMonths)} />
          {answer.extraMonthlyPayment > 0 && <ResultItem label="Interest saved" value={formatLoanAmount(answer.interestSaved)} />}
          {answer.extraMonthlyPayment > 0 && <ResultItem label="Time saved" value={formatLoanDuration(answer.monthsSaved)} />}
        </div>
        <div className="mt-6 border-t border-teal-200 pt-5 text-sm leading-6 text-slate-600 dark:border-teal-900 dark:text-slate-300">
          <p><span className="font-semibold text-slate-800 dark:text-slate-100">Formula:</span> P × r ÷ (1 − (1 + r)<sup>−n</sup>), using the monthly rate r and number of monthly payments n. For a 0% loan, payment is principal ÷ months.</p>
          <p className="mt-3">This estimate assumes a fixed rate, monthly compounding, payments at the end of each month, and any extra payment applied monthly. It does not include lender fees, taxes, insurance, or prepayment penalties.</p>
        </div>
      </>}
    </section>
  </div>
}

function ResultItem({ label, value }) {
  return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">{value}</p></div>
}
