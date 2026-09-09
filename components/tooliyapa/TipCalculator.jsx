'use client'

import { useState } from 'react'
import { CalculatorField } from './CalculatorUI'
import { calculateTip, formatTipNumber } from '@/lib/tip'

const INITIAL = { bill: '', tip: '15', people: '1' }
const PRESETS = [10, 15, 18, 20, 25]

function parse(value, label) {
  if (value.trim() === '') throw new Error(`Enter ${label.toLowerCase()}.`)
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error('Enter a finite number.')
  return number
}

export default function TipCalculator() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [answer, setAnswer] = useState(null)

  const update = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => { const { form, ...rest } = current; return rest })
    setAnswer(null)
  }

  const chooseTip = (tip) => {
    setValues((current) => ({ ...current, tip: String(tip) }))
    setErrors({})
    setAnswer(null)
  }

  function calculate(event) {
    event.preventDefault()
    const nextErrors = {}
    let bill; let tip; let people
    try { bill = parse(values.bill, 'Bill amount') } catch (error) { nextErrors.bill = error.message }
    try { tip = parse(values.tip, 'Tip percentage') } catch (error) { nextErrors.tip = error.message }
    try { people = parse(values.people, 'Number of people') } catch (error) { nextErrors.people = error.message }
    if (Number.isFinite(bill) && bill <= 0) nextErrors.bill = 'Use a bill amount greater than zero.'
    if (Number.isFinite(tip) && tip < 0) nextErrors.tip = 'Use a tip percentage of zero or greater.'
    if (Number.isFinite(people) && (!Number.isInteger(people) || people < 1 || people > 10000)) nextErrors.people = 'Use a whole number from 1 to 10,000.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setAnswer(null); return }
    try { setAnswer(calculateTip(bill, tip, people)) } catch (error) { setAnswer(null); setErrors({ form: error.message }) }
  }

  function reset() { setValues(INITIAL); setErrors({}); setAnswer(null) }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <form onSubmit={calculate} className="space-y-5" noValidate>
        <CalculatorField id="tip-bill" label="Bill amount" value={values.bill} onChange={update('bill')} error={errors.bill} />
        <div>
          <CalculatorField id="tip-percent" label="Tip (%)" value={values.tip} onChange={update('tip')} error={errors.tip} />
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Common tip percentages">{PRESETS.map((tip) => <button key={tip} type="button" aria-pressed={values.tip === String(tip)} onClick={() => chooseTip(tip)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200">{tip}%</button>)}</div>
        </div>
        <CalculatorField id="tip-people" label="Number of people" value={values.people} onChange={update('people')} error={errors.people} hint="Split the total evenly across this many people." />
        {errors.form && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{errors.form}</p>}
        <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">Calculate tip</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Reset</button></div>
      </form>
    </div>
    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Bill result</p>
      {!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter a bill to calculate</p> : <><p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Total with tip</p><p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{formatTipNumber(answer.totalAmount)}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Result label="Tip amount" value={formatTipNumber(answer.tipAmount)} /><Result label="Total per person" value={formatTipNumber(answer.totalPerPerson)} /><Result label="Tip per person" value={formatTipNumber(answer.tipPerPerson)} /><Result label="People" value={String(answer.people)} /></div><p className="mt-6 border-t border-teal-200 pt-5 text-sm leading-6 text-slate-600 dark:border-teal-900 dark:text-slate-300">The calculator applies the selected percentage to the entered bill and then splits the resulting tip and total evenly. It does not automatically add taxes, service charges, discounts, or unequal shares.</p></>}
    </section>
  </div>
}

function Result({ label, value }) { return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">{value}</p></div> }
