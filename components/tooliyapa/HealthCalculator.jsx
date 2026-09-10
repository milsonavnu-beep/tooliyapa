'use client'

import { useState } from 'react'
import { Actions, CalculatorLayout, Field, ResultPanel, Segmented, SelectField } from '@/components/tooliyapa/FormPrimitives'
import { ACTIVITY_LEVELS, calculateBmi, calculateBmr, calculateIdealWeight } from '@/lib/health-calculators'
import { formatNumber } from '@/lib/math-extra'

export default function HealthCalculator({ tool }) {
  if (tool === 'bmi') return <Bmi />
  if (tool === 'bmr') return <Bmr />
  return <IdealWeight />
}

function Bmi() {
  const initial = { weight: '', height: '' }; const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(calculateBmi(v.weight, v.height)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="BMI result" primary={answer ? formatNumber(answer.bmi, 5) : ''} items={answer ? [{label:'Screening range',value:answer.category}] : []} note="BMI is a general screening measure, not a diagnosis or direct measurement of body fat. Do not use this result as a substitute for individualized medical advice." />}><form onSubmit={submit} className="space-y-5"><Field id="bmi-weight" label="Weight (kg)" value={v.weight} onChange={(value) => update('weight', value)} /><Field id="bmi-height" label="Height (cm)" value={v.height} onChange={(value) => update('height', value)} />{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset} /></form></CalculatorLayout>
}

function Bmr() {
  const initial = { sex: 'male', age: '', weight: '', height: '', activity: 'sedentary' }; const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(calculateBmr({ sex: v.sex, age: v.age, weightKg: v.weight, heightCm: v.height, activity: v.activity })); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="Adult energy estimate" primary={answer ? `${Math.round(answer.bmr)} kcal/day BMR` : ''} items={answer ? [{label:'Activity-adjusted estimate',value:`${Math.round(answer.tdee)} kcal/day`},{label:'Activity level',value:answer.activity},{label:'Multiplier',value:String(answer.factor)}] : []} note="Informational adult estimate only. Energy needs can vary substantially, and this is not a prescription for dieting, treatment, pregnancy, childhood, illness, or an eating disorder." />}><form onSubmit={submit} className="space-y-5"><Segmented label="Sex used by equation" value={v.sex} onChange={(value) => update('sex', value)} options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} /><div className="grid gap-4 sm:grid-cols-3"><Field id="bmr-age" label="Age (18–120)" value={v.age} onChange={(value) => update('age', value)} inputMode="numeric" /><Field id="bmr-weight" label="Weight (kg)" value={v.weight} onChange={(value) => update('weight', value)} /><Field id="bmr-height" label="Height (cm)" value={v.height} onChange={(value) => update('height', value)} /></div><SelectField id="activity" label="Activity level" value={v.activity} onChange={(value) => update('activity', value)} options={Object.entries(ACTIVITY_LEVELS).map(([value, info]) => ({ value, label: `${info.label} (×${info.factor})` }))} />{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset} /></form></CalculatorLayout>
}

function IdealWeight() {
  const initial = { sex: 'male', height: '' }; const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(calculateIdealWeight(v.height, v.sex)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="Formula comparison" primary={answer ? `Average: ${formatNumber(answer.average, 5)} kg` : ''} items={answer ? [...Object.entries(answer.formulas).map(([label,value]) => ({label,value:`${formatNumber(value,5)} kg`})),{label:'Formula spread',value:`${formatNumber(answer.min,5)}–${formatNumber(answer.max,5)} kg`}] : []} note="These historical equations are shown for comparison only. They do not define a medically ideal weight or a personalized target." />}><form onSubmit={submit} className="space-y-5"><Segmented label="Sex used by historical formulas" value={v.sex} onChange={(value) => update('sex', value)} options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} /><Field id="ideal-height" label="Adult height (cm)" value={v.height} onChange={(value) => update('height', value)} hint="Supported range starts at 152.4 cm (5 ft)." />{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset} /></form></CalculatorLayout>
}
