'use client'

import { useState } from 'react'
import { CalculatorField } from './CalculatorUI'
import { formatElectricalNumber, solveElectrical } from '@/lib/electrical'

const PAIRS = {
  'voltage-current': { label: 'Voltage + current', first: ['Voltage (V)', 'Enter volts.'], second: ['Current (A)', 'Enter amperes.'] },
  'voltage-resistance': { label: 'Voltage + resistance', first: ['Voltage (V)', 'Enter volts.'], second: ['Resistance (Ω)', 'Enter ohms.'] },
  'voltage-power': { label: 'Voltage + power', first: ['Voltage (V)', 'Enter volts.'], second: ['Power (W)', 'Enter watts.'] },
  'current-resistance': { label: 'Current + resistance', first: ['Current (A)', 'Enter amperes.'], second: ['Resistance (Ω)', 'Enter ohms.'] },
  'current-power': { label: 'Current + power', first: ['Current (A)', 'Enter amperes.'], second: ['Power (W)', 'Enter watts.'] },
  'resistance-power': { label: 'Resistance + power', first: ['Resistance (Ω)', 'Enter ohms.'], second: ['Power (W)', 'Enter watts.'] },
}

export default function ElectricalCalculator() {
  const [pair, setPair] = useState('voltage-current')
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState(null)
  const selected = PAIRS[pair]

  const updateFirst = (event) => { setFirst(event.target.value); setError(''); setAnswer(null) }
  const updateSecond = (event) => { setSecond(event.target.value); setError(''); setAnswer(null) }

  function changePair(event) {
    setPair(event.target.value)
    setFirst('')
    setSecond('')
    setError('')
    setAnswer(null)
  }

  function calculate(event) {
    event.preventDefault()
    try {
      setAnswer(solveElectrical(pair, first, second))
      setError('')
    } catch (err) {
      setAnswer(null)
      setError(err.message)
    }
  }

  function reset() {
    setPair('voltage-current')
    setFirst('')
    setSecond('')
    setError('')
    setAnswer(null)
  }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <form onSubmit={calculate} className="space-y-5" noValidate>
        <div>
          <label htmlFor="electrical-pair" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">Known quantities</label>
          <select id="electrical-pair" value={pair} onChange={changePair} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
            {Object.entries(PAIRS).map(([value, definition]) => <option key={value} value={value}>{definition.label}</option>)}
          </select>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Choose any supported pair. The calculator derives voltage, current, resistance, and power.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorField id="electrical-first" label={selected.first[0]} value={first} onChange={updateFirst} hint={`${selected.first[1]} Use a positive base-unit value.`} />
          <CalculatorField id="electrical-second" label={selected.second[0]} value={second} onChange={updateSecond} hint={`${selected.second[1]} Use a positive base-unit value.`} />
        </div>

        {error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/25 dark:text-amber-200">This calculator applies ideal DC / purely resistive relationships. It does not account for AC power factor, phase angle, reactance, impedance, startup current, wiring limits, or electrical safety requirements.</div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">Calculate electrical values</button>
          <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Reset</button>
        </div>
      </form>
    </div>

    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Electrical result</p>
      {!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter two known values to calculate</p> : <>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Result label="Voltage" value={`${formatElectricalNumber(answer.voltage)} V`} />
          <Result label="Current" value={`${formatElectricalNumber(answer.current)} A`} />
          <Result label="Resistance" value={`${formatElectricalNumber(answer.resistance)} Ω`} />
          <Result label="Power" value={`${formatElectricalNumber(answer.power)} W`} />
        </div>
        <div className="mt-6 border-t border-teal-200 pt-5 text-sm leading-6 text-slate-600 dark:border-teal-900 dark:text-slate-300"><p><span className="font-semibold text-slate-800 dark:text-slate-100">Formula path:</span> {answer.formula}</p><p className="mt-3">Values are shown in volts, amperes, ohms, and watts. Convert milli-, kilo-, or mega-unit inputs to the corresponding base unit before entering them.</p></div>
      </>}
    </section>
  </div>
}

function Result({ label, value }) {
  return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">{value}</p></div>
}
