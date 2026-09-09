'use client'

import { useState } from 'react'
import { calculateStatistics, formatStatistic, parseStatisticsInput } from '@/lib/statistics'

export default function StatisticsCalculator() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState(null)

  function update(event) { setInput(event.target.value); setError(''); setAnswer(null) }
  function calculate(event) {
    event.preventDefault()
    try { setAnswer(calculateStatistics(parseStatisticsInput(input))); setError('') } catch (err) { setAnswer(null); setError(err.message) }
  }
  function reset() { setInput(''); setError(''); setAnswer(null) }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_1fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <form onSubmit={calculate} className="space-y-5" noValidate>
        <div><label htmlFor="statistics-values" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">Dataset values</label><textarea id="statistics-values" value={input} onChange={update} rows={9} aria-invalid={Boolean(error)} aria-describedby={error ? 'statistics-error' : 'statistics-hint'} placeholder="Example: 12, 15, 15, 19, 24" className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /><p id="statistics-hint" className="mt-2 text-xs text-slate-500 dark:text-slate-400">Separate values with commas, spaces, or new lines. Up to 10,000 finite numbers.</p>{error && <p id="statistics-error" role="alert" className="mt-2 text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}</div>
        <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">Calculate statistics</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Reset</button></div>
      </form>
    </div>
    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6"><p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Dataset summary</p>{!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter a dataset to calculate</p> : <div className="mt-5 grid gap-3 sm:grid-cols-2"><Result label="Count" value={String(answer.count)} /><Result label="Sum" value={formatStatistic(answer.sum)} /><Result label="Mean" value={formatStatistic(answer.mean)} /><Result label="Median" value={formatStatistic(answer.median)} /><Result label="Mode" value={answer.modes.length ? answer.modes.map(formatStatistic).join(', ') : 'No repeated mode'} /><Result label="Range" value={formatStatistic(answer.range)} /><Result label="Minimum" value={formatStatistic(answer.min)} /><Result label="Maximum" value={formatStatistic(answer.max)} /><Result label="Population variance" value={formatStatistic(answer.populationVariance)} /><Result label="Sample variance" value={formatStatistic(answer.sampleVariance)} /><Result label="Population standard deviation" value={formatStatistic(answer.populationStandardDeviation)} /><Result label="Sample standard deviation" value={formatStatistic(answer.sampleStandardDeviation)} /><Result label="Geometric mean" value={formatStatistic(answer.geometricMean)} /><Result label="Harmonic mean" value={formatStatistic(answer.harmonicMean)} /></div>}</section>
  </div>
}

function Result({ label, value }) { return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words text-base font-bold text-slate-900 dark:text-white">{value}</p></div> }
