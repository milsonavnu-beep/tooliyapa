'use client'

import { useState } from 'react'
import { calculateFraction, fractionToDecimalString, fractionToMixedString, fractionToPercentString, fractionToString, normalizeFraction } from '@/lib/fraction'

const INITIAL = { mode: 'arithmetic', aNum: '', aDen: '1', bNum: '', bDen: '1', operation: 'add' }
const OPS = { add: '+', subtract: '−', multiply: '×', divide: '÷' }

function FractionInput({ prefix, label, numerator, denominator, onChange, error }) {
  return <fieldset className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><legend className="px-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</legend><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><input aria-label={`${label} numerator`} value={numerator} onChange={(e) => onChange(`${prefix}Num`, e.target.value)} inputMode="numeric" className="min-h-12 rounded-xl border border-slate-300 bg-white px-3 text-center text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /><span className="text-xl font-bold text-slate-500">/</span><input aria-label={`${label} denominator`} value={denominator} onChange={(e) => onChange(`${prefix}Den`, e.target.value)} inputMode="numeric" className="min-h-12 rounded-xl border border-slate-300 bg-white px-3 text-center text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div>{error && <p role="alert" className="mt-2 text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}</fieldset>
}

export default function FractionCalculator() {
  const [values, setValues] = useState(INITIAL)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setValues((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const setMode = (mode) => { setValues((current) => ({ ...current, mode })); setError(''); setAnswer(null) }

  function calculate(event) {
    event.preventDefault()
    try {
      const result = values.mode === 'simplify'
        ? normalizeFraction(values.aNum, values.aDen)
        : calculateFraction(values.aNum, values.aDen, values.bNum, values.bDen, values.operation)
      setAnswer(result); setError('')
    } catch (err) { setAnswer(null); setError(err.message) }
  }
  function reset() { setValues(INITIAL); setError(''); setAnswer(null) }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"><div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">{[['arithmetic', 'Fraction arithmetic'], ['simplify', 'Simplify & convert']].map(([mode, label]) => <button key={mode} type="button" aria-pressed={values.mode === mode} onClick={() => setMode(mode)} className={`min-h-11 rounded-lg px-3 text-sm font-semibold ${values.mode === mode ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{label}</button>)}</div>
      <form onSubmit={calculate} className="space-y-5" noValidate><FractionInput prefix="a" label="First fraction" numerator={values.aNum} denominator={values.aDen} onChange={update} error={error && values.mode === 'simplify' ? error : ''} />{values.mode === 'arithmetic' && <><div><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Operation</p><div className="mt-2 grid grid-cols-4 gap-2">{Object.entries(OPS).map(([key, symbol]) => <button key={key} type="button" aria-pressed={values.operation === key} onClick={() => update('operation', key)} className={`min-h-12 rounded-xl border text-lg font-bold ${values.operation === key ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300' : 'border-slate-300 dark:border-slate-700'}`}>{symbol}</button>)}</div></div><FractionInput prefix="b" label="Second fraction" numerator={values.bNum} denominator={values.bDen} onChange={update} error="" /></>}{error && values.mode === 'arithmetic' && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<div className="flex flex-col gap-3 sm:flex-row"><button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">{values.mode === 'simplify' ? 'Simplify fraction' : 'Calculate fractions'}</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Reset</button></div></form>
    </div>
    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6"><p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Exact fraction result</p>{!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter a fraction to calculate</p> : <><p className="mt-2 break-all text-3xl font-bold text-slate-900 dark:text-white">{fractionToString(answer)}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Result label="Mixed number" value={fractionToMixedString(answer)} /><Result label="Decimal" value={fractionToDecimalString(answer)} /><Result label="Percentage" value={fractionToPercentString(answer)} /><Result label="Denominator" value={answer.denominator.toString()} /></div><p className="mt-6 border-t border-teal-200 pt-5 text-sm leading-6 text-slate-600 dark:border-teal-900 dark:text-slate-300">Fraction arithmetic and simplification use exact integer arithmetic. Decimal and percentage displays are generated afterward and may show an ellipsis when a repeating or longer decimal is truncated.</p></>}</section>
  </div>
}

function Result({ label, value }) { return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-all text-lg font-bold text-slate-900 dark:text-white">{value}</p></div> }
