'use client'

import { useState } from 'react'
import { changeCalculationInput } from '@/lib/calculator-state'
import { applyPercentageChange, calculatePercentageChange, calculatePercentOf, calculateWhatPercent, formatCalculatorNumber } from '@/lib/percentage'
import { CalculatorField, CalculatorResult } from './CalculatorUI'

const MODES = [
  ['percentOf', 'Percent of a number'], ['whatPercent', 'What percent?'], ['change', 'Percentage change'], ['adjust', 'Increase or decrease'],
]
const INITIAL = { a: '', b: '', direction: 'increase' }

function parseNumber(value) {
  if (value.trim() === '') throw new Error('Enter a value.')
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error('Enter a finite number.')
  return number
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState('percentOf')
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [answer, setAnswer] = useState(null)
  const f = formatCalculatorNumber
  const update = (key) => (event) => {
    const next = changeCalculationInput({ values, errors, answer }, key, event.target.value)
    setValues(next.values)
    setErrors(next.errors)
    setAnswer(next.answer)
  }
  const chooseMode = (next) => { setMode(next); setValues(INITIAL); setErrors({}); setAnswer(null) }

  function calculate(event) {
    event.preventDefault()
    const nextErrors = {}
    let a; let b
    try { a = parseNumber(values.a) } catch (error) { nextErrors.a = error.message }
    try { b = parseNumber(values.b) } catch (error) { nextErrors.b = error.message }
    if (mode === 'whatPercent' && b === 0) nextErrors.b = 'The whole value must not be zero.'
    if (mode === 'change' && Number.isFinite(a) && a <= 0) nextErrors.a = 'Percentage change currently requires a positive starting value.'
    if (mode === 'adjust' && Number.isFinite(b) && b < 0) nextErrors.b = 'Use a percentage of zero or greater, then choose increase or decrease.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setAnswer(null); return }

    try {
      if (mode === 'percentOf') {
        const output = calculatePercentOf(a, b)
        setAnswer({ primary: f(output), formula: `${f(b)} × ${f(a)} ÷ 100`, meaning: `${f(a)}% of ${f(b)} is ${f(output)}.` })
      } else if (mode === 'whatPercent') {
        const output = calculateWhatPercent(a, b)
        setAnswer({ primary: `${f(output)}%`, formula: `${f(a)} ÷ ${f(b)} × 100`, meaning: `${f(a)} is ${f(output)}% of ${f(b)}.` })
      } else if (mode === 'change') {
        const output = calculatePercentageChange(a, b)
        const direction = output > 0 ? 'increase' : output < 0 ? 'decrease' : 'no change'
        const magnitude = Math.abs(output)
        setAnswer({ primary: direction === 'no change' ? '0% — no change' : `${f(magnitude)}% ${direction}`, formula: `(${f(b)} − ${f(a)}) ÷ ${f(a)} × 100`, meaning: direction === 'no change' ? `The value stayed at ${f(a)}, so there was no percentage change.` : `The value ${direction === 'increase' ? 'increased' : 'decreased'} from ${f(a)} to ${f(b)}, which is a ${f(magnitude)}% ${direction}.` })
      } else {
        const output = applyPercentageChange(a, b, values.direction)
        const verb = values.direction === 'increase' ? 'increased' : 'decreased'
        setAnswer({ primary: f(output), formula: `${f(a)} × (1 ${values.direction === 'increase' ? '+' : '−'} ${f(b)} ÷ 100)`, meaning: `${f(a)} ${verb} by ${f(b)}% is ${f(output)}.${values.direction === 'decrease' && b > 100 ? ' A decrease above 100% produces a value below zero when the base is positive.' : ''}` })
      }
    } catch (error) { setAnswer(null); setErrors({ form: error.message }) }
  }

  const labels = mode === 'percentOf' ? ['Percentage', 'Number'] : mode === 'whatPercent' ? ['Part (X)', 'Whole (Y)'] : mode === 'change' ? ['Starting value', 'New value'] : ['Base value', 'Percentage']
  return <div className="mt-9 grid min-w-0 gap-6 lg:grid-cols-[1.15fr_.85fr]">
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div aria-label="Percentage calculation mode" className="grid gap-2 sm:grid-cols-2">{MODES.map(([id, label]) => <button key={id} type="button" aria-pressed={mode === id} onClick={() => chooseMode(id)} className={`min-h-12 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${mode === id ? 'bg-slate-900 text-white dark:bg-teal-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}>{label}</button>)}</div>
      <form onSubmit={calculate} className="mt-6 space-y-5" noValidate>
        <CalculatorField id="percentage-value-a" label={labels[0]} value={values.a} onChange={update('a')} error={errors.a} />
        <CalculatorField id="percentage-value-b" label={labels[1]} value={values.b} onChange={update('b')} error={errors.b} hint={mode === 'adjust' && values.direction === 'decrease' ? 'Reductions above 100% are allowed and may produce a negative result.' : undefined} />
        {mode === 'adjust' && <fieldset><legend className="text-sm font-semibold text-slate-800 dark:text-slate-200">Operation</legend><div className="mt-2 flex gap-3">{['increase', 'decrease'].map((direction) => <label key={direction} className="flex min-h-11 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-3 capitalize dark:border-slate-700"><input type="radio" name="direction" value={direction} checked={values.direction === direction} onChange={update('direction')} />{direction}</label>)}</div></fieldset>}
        {errors.form && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{errors.form}</p>}
        <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">Calculate</button><button type="button" onClick={() => { setValues(INITIAL); setErrors({}); setAnswer(null) }} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Reset</button></div>
      </form>
    </div><CalculatorResult result={answer} />
  </div>
}
