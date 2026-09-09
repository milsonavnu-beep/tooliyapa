'use client'

import { useState } from 'react'
import { CalculatorField } from './CalculatorUI'
import { BASIC_OPERATIONS, calculateBasic, formatBasicNumber } from '@/lib/basic'

const INITIAL = { left: '', right: '', operation: 'add' }

function parse(value, label) {
  if (value.trim() === '') throw new Error(`Enter ${label.toLowerCase()}.`)
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error('Enter a finite number.')
  return number
}

export default function BasicCalculator() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [answer, setAnswer] = useState(null)

  const update = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => { const { form, ...rest } = current; return rest })
    setAnswer(null)
  }

  const chooseOperation = (operation) => {
    setValues((current) => ({ ...current, operation }))
    setErrors({})
    setAnswer(null)
  }

  function calculate(event) {
    event.preventDefault()
    const nextErrors = {}
    let left; let right
    try { left = parse(values.left, 'First value') } catch (error) { nextErrors.left = error.message }
    try { right = parse(values.right, 'Second value') } catch (error) { nextErrors.right = error.message }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setAnswer(null); return }
    try { setAnswer({ value: calculateBasic(left, right, values.operation), left, right, operation: values.operation }) } catch (error) { setAnswer(null); setErrors({ form: error.message }) }
  }

  function reset() { setValues(INITIAL); setErrors({}); setAnswer(null) }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <form onSubmit={calculate} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2"><CalculatorField id="basic-left" label="First value" value={values.left} onChange={update('left')} error={errors.left} /><CalculatorField id="basic-right" label="Second value" value={values.right} onChange={update('right')} error={errors.right} /></div>
        <div><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Operation</p><div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">{Object.entries(BASIC_OPERATIONS).map(([key, op]) => <button key={key} type="button" aria-pressed={values.operation === key} onClick={() => chooseOperation(key)} className={`min-h-12 rounded-xl border text-lg font-bold ${values.operation === key ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300' : 'border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}>{op.label}</button>)}</div></div>
        {errors.form && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{errors.form}</p>}
        <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">Calculate</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Clear</button></div>
      </form>
    </div>
    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6"><p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Result</p>{!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter two values to calculate</p> : <><p className="mt-2 break-words text-4xl font-bold text-slate-900 dark:text-white">{formatBasicNumber(answer.value)}</p><p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{formatBasicNumber(answer.left)} {BASIC_OPERATIONS[answer.operation].label} {formatBasicNumber(answer.right)} = {formatBasicNumber(answer.value)}</p><p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Operation: {BASIC_OPERATIONS[answer.operation].name}</p></>}</section>
  </div>
}
