'use client'

import { useState } from 'react'
import { CalculatorField } from './CalculatorUI'
import { calculateCompoundInterest, calculateSimpleInterest, formatInterestNumber } from '@/lib/interest'

const INITIAL = { mode: 'compound', principal: '', rate: '', years: '', frequency: '12', contribution: '' }

function parse(value, label, optional = false) {
  if (value.trim() === '') {
    if (optional) return 0
    throw new Error(`Enter ${label.toLowerCase()}.`)
  }
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error('Enter a finite number.')
  return number
}

export default function InterestCalculator() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [answer, setAnswer] = useState(null)

  const update = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => { const { form, ...rest } = current; return rest })
    setAnswer(null)
  }

  const setMode = (mode) => {
    setValues((current) => ({ ...current, mode }))
    setErrors({})
    setAnswer(null)
  }

  function calculate(event) {
    event.preventDefault()
    const nextErrors = {}
    let principal; let rate; let years; let frequency; let contribution
    try { principal = parse(values.principal, 'Principal') } catch (error) { nextErrors.principal = error.message }
    try { rate = parse(values.rate, 'Annual interest rate') } catch (error) { nextErrors.rate = error.message }
    try { years = parse(values.years, 'Term') } catch (error) { nextErrors.years = error.message }
    if (values.mode === 'compound') {
      try { frequency = parse(values.frequency, 'Compounding frequency') } catch (error) { nextErrors.frequency = error.message }
      try { contribution = parse(values.contribution, 'Contribution', true) } catch (error) { nextErrors.contribution = error.message }
    }
    if (Number.isFinite(principal) && principal < 0) nextErrors.principal = 'Use a principal of zero or greater.'
    if (Number.isFinite(rate) && rate < 0) nextErrors.rate = 'Use an annual rate of zero or greater.'
    if (Number.isFinite(years) && years <= 0) nextErrors.years = 'Use a term greater than zero.'
    if (Number.isFinite(frequency) && (!Number.isInteger(frequency) || frequency < 1 || frequency > 365)) nextErrors.frequency = 'Use a whole number from 1 to 365.'
    if (Number.isFinite(contribution) && contribution < 0) nextErrors.contribution = 'Use a contribution of zero or greater.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setAnswer(null); return }

    try {
      if (values.mode === 'simple') {
        setAnswer({ mode: 'simple', ...calculateSimpleInterest(principal, rate, years), principal })
      } else {
        setAnswer({ mode: 'compound', ...calculateCompoundInterest({ principal, annualRatePercent: rate, years, compoundsPerYear: frequency, contributionPerPeriod: contribution }), principal, contribution })
      }
    } catch (error) {
      setAnswer(null)
      setErrors({ form: error.message })
    }
  }

  function reset() { setValues(INITIAL); setErrors({}); setAnswer(null) }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" aria-label="Interest calculation type">
        {['compound', 'simple'].map((mode) => <button key={mode} type="button" aria-pressed={values.mode === mode} onClick={() => setMode(mode)} className={`min-h-11 rounded-lg px-3 text-sm font-semibold ${values.mode === mode ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{mode === 'compound' ? 'Compound interest' : 'Simple interest'}</button>)}
      </div>
      <form onSubmit={calculate} className="space-y-5" noValidate>
        <CalculatorField id="interest-principal" label="Starting principal" value={values.principal} onChange={update('principal')} error={errors.principal} hint="Use the currency amount you are starting with. Zero is allowed when recurring contributions are used." />
        <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorField id="interest-rate" label="Annual interest rate (%)" value={values.rate} onChange={update('rate')} error={errors.rate} />
          <CalculatorField id="interest-years" label="Term (years)" value={values.years} onChange={update('years')} error={errors.years} hint={values.mode === 'compound' ? 'The term must contain a whole number of compounding periods.' : undefined} />
        </div>
        {values.mode === 'compound' && <>
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorField id="interest-frequency" label="Compounds per year" value={values.frequency} onChange={update('frequency')} error={errors.frequency} hint="12 = monthly, 4 = quarterly, 1 = annually." />
            <CalculatorField id="interest-contribution" label="Contribution each period (optional)" value={values.contribution} onChange={update('contribution')} error={errors.contribution} hint="Assumed at the end of each compounding period." />
          </div>
        </>}
        {errors.form && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{errors.form}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">Calculate interest</button>
          <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Reset</button>
        </div>
      </form>
    </div>

    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Estimated growth</p>
      {!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter values to calculate</p> : answer.mode === 'simple' ? <>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Final amount</p>
        <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{formatInterestNumber(answer.finalAmount)}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><Result label="Interest earned" value={formatInterestNumber(answer.interest)} /><Result label="Starting principal" value={formatInterestNumber(answer.principal)} /></div>
        <p className="mt-6 border-t border-teal-200 pt-5 text-sm leading-6 text-slate-600 dark:border-teal-900 dark:text-slate-300"><span className="font-semibold text-slate-800 dark:text-slate-100">Formula:</span> principal × annual rate × time. Simple interest does not earn interest on earlier interest.</p>
      </> : <>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Future value</p>
        <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{formatInterestNumber(answer.finalAmount)}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><Result label="Interest earned" value={formatInterestNumber(answer.interestEarned)} /><Result label="Total contributed" value={formatInterestNumber(answer.totalContributions)} /><Result label="APY" value={`${formatInterestNumber(answer.apyPercent)}%`} /><Result label="Compounding periods" value={formatInterestNumber(answer.periods)} /></div>
        <p className="mt-6 border-t border-teal-200 pt-5 text-sm leading-6 text-slate-600 dark:border-teal-900 dark:text-slate-300">Recurring contributions are treated as ordinary end-of-period payments. APY shows the effective annual yield implied by the nominal rate and selected compounding frequency.</p>
      </>}
    </section>
  </div>
}

function Result({ label, value }) { return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">{value}</p></div> }
