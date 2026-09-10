'use client'

import { useState } from 'react'
import { CalculatorField } from './CalculatorUI'
import { formatProportionResult, formatRatio, formatRatioNumber, proportionDecimal, simplifyRatio, solveProportion, splitTotalByRatio } from '@/lib/ratio'

const INITIAL = {
  mode: 'simplify',
  left: '',
  right: '',
  a: '',
  b: '',
  c: '',
  total: '',
  splitLeft: '',
  splitRight: '',
}

const MODES = [
  ['simplify', 'Simplify ratio'],
  ['proportion', 'Solve proportion'],
  ['split', 'Split a total'],
]

export default function RatioCalculator() {
  const [values, setValues] = useState(INITIAL)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState(null)

  const update = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    setError('')
    setAnswer(null)
  }

  const setMode = (mode) => {
    setValues((current) => ({ ...current, mode }))
    setError('')
    setAnswer(null)
  }

  function calculate(event) {
    event.preventDefault()
    try {
      if (values.mode === 'simplify') {
        const result = simplifyRatio(values.left, values.right)
        setAnswer({ mode: 'simplify', result })
      } else if (values.mode === 'proportion') {
        const result = solveProportion(values.a, values.b, values.c)
        setAnswer({ mode: 'proportion', result })
      } else {
        const result = splitTotalByRatio(values.total, values.splitLeft, values.splitRight)
        setAnswer({ mode: 'split', result })
      }
      setError('')
    } catch (err) {
      setAnswer(null)
      setError(err.message)
    }
  }

  function reset() {
    setValues(INITIAL)
    setError('')
    setAnswer(null)
  }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 grid gap-2 rounded-xl bg-slate-100 p-1 sm:grid-cols-3 dark:bg-slate-800">
        {MODES.map(([mode, label]) => <button key={mode} type="button" aria-pressed={values.mode === mode} onClick={() => setMode(mode)} className={`min-h-11 rounded-lg px-3 text-sm font-semibold ${values.mode === mode ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{label}</button>)}
      </div>

      <form onSubmit={calculate} className="space-y-5" noValidate>
        {values.mode === 'simplify' && <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorField id="ratio-left" label="First ratio term" value={values.left} onChange={update('left')} hint="Whole integer, up to 100 digits." />
          <CalculatorField id="ratio-right" label="Second ratio term" value={values.right} onChange={update('right')} hint="Must not be zero." />
        </div>}

        {values.mode === 'proportion' && <>
          <div className="grid gap-5 sm:grid-cols-3">
            <CalculatorField id="ratio-a" label="a" value={values.a} onChange={update('a')} hint="For a : b = c : x" />
            <CalculatorField id="ratio-b" label="b" value={values.b} onChange={update('b')} hint="Second term" />
            <CalculatorField id="ratio-c" label="c" value={values.c} onChange={update('c')} hint="Third term" />
          </div>
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950/60 dark:text-slate-300">Solves <strong>a : b = c : x</strong> exactly. The result for x may be a fraction.</p>
        </>}

        {values.mode === 'split' && <>
          <CalculatorField id="ratio-total" label="Total to split" value={values.total} onChange={update('total')} hint="Any finite value of zero or greater." />
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorField id="ratio-split-left" label="First ratio part" value={values.splitLeft} onChange={update('splitLeft')} hint="Positive whole integer." />
            <CalculatorField id="ratio-split-right" label="Second ratio part" value={values.splitRight} onChange={update('splitRight')} hint="Positive whole integer." />
          </div>
        </>}

        {error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">Calculate ratio</button>
          <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Reset</button>
        </div>
      </form>
    </div>

    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Ratio result</p>
      {!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter values to calculate</p> : <RatioResult answer={answer} />}
    </section>
  </div>
}

function RatioResult({ answer }) {
  if (answer.mode === 'simplify') {
    return <><p className="mt-2 break-words text-3xl font-bold text-slate-900 dark:text-white">{formatRatio(answer.result.left, answer.result.right)}</p><p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">The terms were reduced by their greatest common factor and the sign was normalized so the second term stays positive.</p></>
  }

  if (answer.mode === 'proportion') {
    return <><p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">x =</p><p className="mt-1 break-all text-3xl font-bold text-slate-900 dark:text-white">{formatProportionResult(answer.result)}</p><div className="mt-5 rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Decimal form</p><p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{proportionDecimal(answer.result)}</p></div><p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">For a : b = c : x, cross-multiplication gives a × x = b × c, so x = (b × c) ÷ a.</p></>
  }

  return <><p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Split {formatRatioNumber(answer.result.total)} in the ratio {answer.result.left.toString()} : {answer.result.right.toString()}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Result label="First share" value={formatRatioNumber(answer.result.firstShare)} /><Result label="Second share" value={formatRatioNumber(answer.result.secondShare)} /></div><p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">Each share equals the total multiplied by that ratio part divided by the sum of all ratio parts.</p></>
}

function Result({ label, value }) {
  return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">{value}</p></div>
}
