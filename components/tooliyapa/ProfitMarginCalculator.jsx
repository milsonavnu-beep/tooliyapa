'use client'

import { useState } from 'react'
import { CalculatorField } from './CalculatorUI'
import { calculateProfitMargin, formatBusinessNumber } from '@/lib/profit-margin'

const INITIAL = { cost: '', price: '', quantity: '1' }

function parse(value, label) {
  if (value.trim() === '') throw new Error(`Enter ${label.toLowerCase()}.`)
  const number = Number(value)
  if (!Number.isFinite(number)) throw new Error('Enter a finite number.')
  return number
}

export default function ProfitMarginCalculator() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [answer, setAnswer] = useState(null)

  const update = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => { const { form, ...rest } = current; return rest })
    setAnswer(null)
  }

  function calculate(event) {
    event.preventDefault()
    const nextErrors = {}
    let cost; let price; let quantity
    try { cost = parse(values.cost, 'Cost per unit') } catch (error) { nextErrors.cost = error.message }
    try { price = parse(values.price, 'Selling price per unit') } catch (error) { nextErrors.price = error.message }
    try { quantity = parse(values.quantity, 'Quantity') } catch (error) { nextErrors.quantity = error.message }
    if (Number.isFinite(cost) && cost < 0) nextErrors.cost = 'Use a cost of zero or greater.'
    if (Number.isFinite(price) && price <= 0) nextErrors.price = 'Use a selling price greater than zero.'
    if (Number.isFinite(quantity) && quantity <= 0) nextErrors.quantity = 'Use a quantity greater than zero.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { setAnswer(null); return }
    try { setAnswer(calculateProfitMargin(cost, price, quantity)) } catch (error) { setAnswer(null); setErrors({ form: error.message }) }
  }

  function reset() { setValues(INITIAL); setErrors({}); setAnswer(null) }

  return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <form onSubmit={calculate} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <CalculatorField id="margin-cost" label="Cost per unit" value={values.cost} onChange={update('cost')} error={errors.cost} hint="Include the unit cost you want this calculation to compare with the sale price." />
          <CalculatorField id="margin-price" label="Selling price per unit" value={values.price} onChange={update('price')} error={errors.price} />
        </div>
        <CalculatorField id="margin-quantity" label="Quantity" value={values.quantity} onChange={update('quantity')} error={errors.quantity} hint="Use 1 for per-unit economics only, or another positive quantity for totals." />
        {errors.form && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{errors.form}</p>}
        <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">Calculate margin</button><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Reset</button></div>
      </form>
    </div>
    <section aria-live="polite" aria-atomic="true" className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Business result</p>
      {!answer ? <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Enter cost and price to calculate</p> : <><p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Profit margin</p><p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{formatBusinessNumber(answer.marginPercent)}%</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Result label="Profit per unit" value={formatBusinessNumber(answer.profitPerUnit)} /><Result label="Markup" value={answer.markupPercent === null ? 'Not defined at zero cost' : `${formatBusinessNumber(answer.markupPercent)}%`} /><Result label="Total revenue" value={formatBusinessNumber(answer.revenue)} /><Result label="Total cost" value={formatBusinessNumber(answer.totalCost)} /><Result label="Total profit" value={formatBusinessNumber(answer.totalProfit)} /><Result label="Quantity" value={formatBusinessNumber(answer.quantity)} /></div><p className="mt-6 border-t border-teal-200 pt-5 text-sm leading-6 text-slate-600 dark:border-teal-900 dark:text-slate-300"><span className="font-semibold text-slate-800 dark:text-slate-100">Margin</span> is profit divided by selling price. <span className="font-semibold text-slate-800 dark:text-slate-100">Markup</span> is profit divided by cost. They are not the same percentage.</p></>}
    </section>
  </div>
}

function Result({ label, value }) { return <div className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">{value}</p></div> }
