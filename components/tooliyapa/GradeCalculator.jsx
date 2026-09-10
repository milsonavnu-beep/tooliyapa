'use client'

import { useState } from 'react'
import { CalculatorField } from './CalculatorUI'
import { calculateRequiredFinalGrade, calculateScorePercentage, calculateWeightedGrade, formatGradeNumber } from '@/lib/grade'

const EMPTY_ITEMS = Array.from({ length: 5 }, () => ({ score: '', weight: '' }))
const INITIAL = {
  mode: 'score',
  earned: '',
  possible: '',
  currentGrade: '',
  completedWeight: '',
  targetGrade: '',
  items: EMPTY_ITEMS,
}

const MODES = [
  ['score', 'Marks → percentage'],
  ['weighted', 'Weighted grade'],
  ['final', 'Final grade needed'],
]

export default function GradeCalculator() {
  const [values, setValues] = useState(INITIAL)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState(null)

  const clearDerived = () => { setError(''); setAnswer(null) }
  const update = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    clearDerived()
  }
  const updateItem = (index, key, value) => {
    setValues((current) => ({ ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }))
    clearDerived()
  }
  const setMode = (mode) => {
    setValues((current) => ({ ...current, mode }))
    clearDerived()
  }

  function calculate(event) {
    event.preventDefault()
    try {
      if (values.mode === 'score') {
        setAnswer({ mode: 'score', result: calculateScorePercentage(values.earned, values.possible) })
      } else if (values.mode === 'weighted') {
        const usedItems = values.items
          .map((item, index) => ({ ...item, index }))
          .filter(({ score, weight }) => score.trim() !== '' || weight.trim() !== '')
        if (!usedItems.length) throw new Error('Enter at least one score and weight.')
        const incomplete = usedItems.find(({ score, weight }) => score.trim() === '' || weight.trim() === '')
        if (incomplete) throw new Error(`Complete both score and weight for item ${incomplete.index + 1}.`)
        setAnswer({ mode: 'weighted', result: calculateWeightedGrade(usedItems.map(({ score, weight }) => ({ score, weight }))) })
      } else {
        setAnswer({ mode: 'final', result: calculateRequiredFinalGrade(values.currentGrade, values.completedWeight, values.targetGrade) })
      }
      setError('')
    } catch (err) {
      setAnswer(null)
      setError(err.message)
    }
  }

  function reset() {
    setValues({ ...INITIAL, items: Array.from({ length: 5 }, () => ({ score: '', weight: '' })) })
    setError('')
    setAnswer(null)
  }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 grid gap-2 rounded-xl bg-slate-100 p-1 sm:grid-cols-3 dark:bg-slate-800">
        {MODES.map(([mode, label]) => <button key={mode} type="button" aria-pressed={values.mode === mode} onClick={() => setMode(mode)} className={`min-h-11 rounded-lg px-3 text-sm font-semibold ${values.mode === mode ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{label}</button>)}
      </div>

      <form onSubmit={calculate} className="space-y-5" noValidate>
        {values.mode === 'score' && <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorField id="grade-earned" label="Points earned" value={values.earned} onChange={update('earned')} hint="Zero or greater. Extra-credit totals above the possible points are allowed." />
          <CalculatorField id="grade-possible" label="Points possible" value={values.possible} onChange={update('possible')} hint="Must be greater than zero." />
        </div>}

        {values.mode === 'weighted' && <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Enter up to five graded components. Weights are percentages of the full course and the combined weight cannot exceed 100%.</p>
          {values.items.map((item, index) => <fieldset key={index} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><legend className="px-1 text-sm font-semibold text-slate-800 dark:text-slate-200">Item {index + 1}</legend><div className="grid gap-4 sm:grid-cols-2"><CalculatorField id={`grade-score-${index}`} label="Score (%)" value={item.score} onChange={(event) => updateItem(index, 'score', event.target.value)} hint="Example: 84" /><CalculatorField id={`grade-weight-${index}`} label="Weight (%)" value={item.weight} onChange={(event) => updateItem(index, 'weight', event.target.value)} hint="Example: 20" /></div></fieldset>)}
        </div>}

        {values.mode === 'final' && <>
          <CalculatorField id="grade-current" label="Current grade on completed work (%)" value={values.currentGrade} onChange={update('currentGrade')} hint="Your average across work already completed." />
          <div className="grid gap-5 sm:grid-cols-2">
            <CalculatorField id="grade-completed-weight" label="Course weight already completed (%)" value={values.completedWeight} onChange={update('completedWeight')} hint="Greater than 0 and less than 100." />
            <CalculatorField id="grade-target" label="Target overall grade (%)" value={values.targetGrade} onChange={update('targetGrade')} hint="The final course percentage you want to reach." />
          </div>
        </>}

        {error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">Calculate grade</button>
          <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Reset</button>
        </div>
      </form>
    </div>

    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Grade result</p>
      {!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter grade details to calculate</p> : <GradeResult answer={answer} />}
    </section>
  </div>
}

function GradeResult({ answer }) {
  if (answer.mode === 'score') {
    const { earned, possible, percentage } = answer.result
    return <><p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{formatGradeNumber(percentage)}%</p><p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{formatGradeNumber(earned)} ÷ {formatGradeNumber(possible)} × 100 = {formatGradeNumber(percentage)}%. Letter-grade cutoffs are not shown because grading scales vary by school and course.</p></>
  }

  if (answer.mode === 'weighted') {
    const { weightedAverage, weightedPoints, weightTotal } = answer.result
    return <><p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Weighted average of entered items</p><p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{formatGradeNumber(weightedAverage)}%</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Result label="Weight included" value={`${formatGradeNumber(weightTotal)}%`} /><Result label="Course points contributed" value={`${formatGradeNumber(weightedPoints)} percentage points`} /></div><p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">The weighted average normalizes only the items you entered. {weightTotal < 100 ? `Those items represent ${formatGradeNumber(weightTotal)}% of the full course, so the remaining course weight is not included yet.` : 'The entered weights total 100%, so the weighted average is also the full-course weighted grade.'}</p></>
  }

  const { requiredFinalGrade, remainingWeight, status } = answer.result
  const displayedRequirement = status === 'target-already-secured' ? 0 : requiredFinalGrade
  return <><p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Required average on the remaining {formatGradeNumber(remainingWeight)}%</p><p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{formatGradeNumber(displayedRequirement)}%</p><p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{status === 'target-already-secured' ? 'Your target is already secured even if the remaining work scores 0%, assuming the current average and weights are correct.' : status === 'above-100' ? `The mathematical requirement is ${formatGradeNumber(requiredFinalGrade)}%, which is above 100%. Reaching the target would normally require extra credit or a change in the grading assumptions.` : `An average of ${formatGradeNumber(requiredFinalGrade)}% across the remaining work would reach the target under these weights.`}</p></>
}

function Result({ label, value }) {
  return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">{value}</p></div>
}
