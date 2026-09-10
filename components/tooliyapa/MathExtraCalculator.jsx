'use client'

import { useState } from 'react'
import { Actions, CalculatorLayout, Checkbox, Field, ResultPanel, Segmented, SelectField } from '@/components/tooliyapa/FormPrimitives'
import { calculateBaseArithmetic, calculateGcdLcm, formatNumber, generateRandomNumbers, scientificCalculate, solveQuadratic } from '@/lib/math-extra'

const SCI_OPS = [
  ['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan'], ['asin', 'asin'], ['acos', 'acos'], ['atan', 'atan'],
  ['sqrt', '√x'], ['cbrt', '∛x'], ['ln', 'ln'], ['log10', 'log₁₀'], ['exp', 'eˣ'], ['power', 'xʸ'], ['factorial', 'x!'], ['reciprocal', '1/x'], ['abs', '|x|'],
].map(([value, label]) => ({ value, label }))

export default function MathExtraCalculator({ tool }) {
  if (tool === 'scientific') return <Scientific />
  if (tool === 'lcm-gcf') return <GcdLcm />
  if (tool === 'quadratic') return <Quadratic />
  if (tool === 'base-arithmetic') return <BaseArithmetic />
  return <RandomNumbers />
}

function Scientific() {
  const initial = { operation: 'sin', x: '', y: '', angleUnit: 'deg' }
  const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(scientificCalculate(v)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  const needsY = v.operation === 'power'
  return <CalculatorLayout result={<ResultPanel title="Scientific result" primary={answer === null ? '' : formatNumber(answer, 12)} note="Trigonometric functions use the selected angle unit. Results are rounded for display, not silently treated as exact constants." />}><form onSubmit={submit} className="space-y-5"><SelectField id="scientific-operation" label="Operation" value={v.operation} onChange={(value) => update('operation', value)} options={SCI_OPS} /><Field id="scientific-x" label="Value" value={v.x} onChange={(value) => update('x', value)} error={error} />{needsY && <Field id="scientific-y" label="Exponent" value={v.y} onChange={(value) => update('y', value)} />}{['sin','cos','tan','asin','acos','atan'].includes(v.operation) && <Segmented label="Angle unit" value={v.angleUnit} onChange={(value) => update('angleUnit', value)} options={[{ value: 'deg', label: 'Degrees' }, { value: 'rad', label: 'Radians' }]} />}<Actions onReset={reset} /></form></CalculatorLayout>
}

function GcdLcm() {
  const [input, setInput] = useState(''); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const reset = () => { setInput(''); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(calculateGcdLcm(input)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="GCF & LCM" primary={answer ? `GCF: ${answer.gcd}` : ''} items={answer ? [{ label: 'Least common multiple', value: answer.lcm.toString() }, { label: 'Values used', value: answer.count.toString() }] : []} note="Negative inputs are handled by magnitude. Exact BigInt arithmetic prevents rounding of large whole numbers." />}><form onSubmit={submit} className="space-y-5"><Field id="integer-list" label="Whole integers" value={input} onChange={(value) => { setInput(value); setError(''); setAnswer(null) }} error={error} hint="Separate values with commas or spaces, for example: 18, 24, 30" inputMode="text" /><Actions onReset={reset} /></form></CalculatorLayout>
}

function Quadratic() {
  const initial = { a: '1', b: '', c: '' }; const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(solveQuadratic(v.a, v.b, v.c)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  let primary = ''; let items = []
  if (answer) {
    primary = answer.kind === 'complex' ? `${formatNumber(answer.real)} ± ${formatNumber(answer.imaginary)}i` : answer.kind === 'repeated' ? `x = ${formatNumber(answer.roots[0])}` : `x = ${formatNumber(answer.roots[0])}, ${formatNumber(answer.roots[1])}`
    items = [{ label: 'Discriminant', value: formatNumber(answer.discriminant) }, { label: 'Root type', value: answer.kind }, { label: 'Axis of symmetry', value: `x = ${formatNumber(answer.vertexX)}` }, { label: 'Vertex', value: `(${formatNumber(answer.vertexX)}, ${formatNumber(answer.vertexY)})` }]
  }
  return <CalculatorLayout result={<ResultPanel title="Quadratic solution" primary={primary} items={items} />}><form onSubmit={submit} className="space-y-5"><p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950/40 dark:text-slate-300">Solve <strong>ax² + bx + c = 0</strong></p><div className="grid gap-4 sm:grid-cols-3"><Field id="qa" label="a" value={v.a} onChange={(value) => update('a', value)} /><Field id="qb" label="b" value={v.b} onChange={(value) => update('b', value)} /><Field id="qc" label="c" value={v.c} onChange={(value) => update('c', value)} /></div>{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset} /></form></CalculatorLayout>
}

function BaseArithmetic() {
  const initial = { base: '2', a: '', b: '', operation: 'add' }; const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(calculateBaseArithmetic(v.a, v.b, Number(v.base), v.operation)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="Base arithmetic result" primary={answer?.formatted || ''} items={answer && v.operation === 'divide' ? [{ label: 'Remainder', value: answer.remainderFormatted }] : []} note="Inputs and outputs stay in the selected base. Division reports a whole-number quotient and remainder." />}><form onSubmit={submit} className="space-y-5"><SelectField id="base" label="Number base" value={v.base} onChange={(value) => update('base', value)} options={[2,8,10,16].map((base) => ({ value: String(base), label: `Base ${base}${base===2?' (binary)':base===8?' (octal)':base===16?' (hexadecimal)':' (decimal)'}` }))} /><Field id="base-a" label="First integer" value={v.a} onChange={(value) => update('a', value)} inputMode="text" /><Segmented label="Operation" value={v.operation} onChange={(value) => update('operation', value)} options={[{value:'add',label:'+'},{value:'subtract',label:'−'},{value:'multiply',label:'×'},{value:'divide',label:'÷'}]} /><Field id="base-b" label="Second integer" value={v.b} onChange={(value) => update('b', value)} inputMode="text" />{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset} /></form></CalculatorLayout>
}

function RandomNumbers() {
  const initial = { min: '1', max: '100', count: '1', integers: true, unique: false }; const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(generateRandomNumbers({ min: v.min, max: v.max, count: v.count, integers: v.integers, unique: v.unique })); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="Random values" primary={answer ? answer.map((value) => v.integers ? value : formatNumber(value, 12)).join(', ') : ''} note="This generator is for ordinary randomization, not passwords, security keys, gambling, or cryptographic use." />}><form onSubmit={submit} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field id="random-min" label="Minimum" value={v.min} onChange={(value) => update('min', value)} /><Field id="random-max" label="Maximum" value={v.max} onChange={(value) => update('max', value)} /></div><Field id="random-count" label="How many values?" value={v.count} onChange={(value) => update('count', value)} inputMode="numeric" /><Checkbox id="random-integers" label="Whole numbers only" checked={v.integers} onChange={(value) => update('integers', value)} />{v.integers && <Checkbox id="random-unique" label="Require unique results" checked={v.unique} onChange={(value) => update('unique', value)} />}{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions submitLabel="Generate" onReset={reset} /></form></CalculatorLayout>
}
