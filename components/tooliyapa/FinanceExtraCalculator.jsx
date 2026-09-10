'use client'

import { useState } from 'react'
import { Actions, CalculatorLayout, Field, ResultPanel, Segmented } from '@/components/tooliyapa/FormPrimitives'
import { calculateDiscount, calculateTax } from '@/lib/finance-extra'
import { formatNumber } from '@/lib/math-extra'

function money(value) { return formatNumber(value, 10) }

export default function FinanceExtraCalculator({ tool }) { return tool === 'discount' ? <Discount /> : <Tax /> }

function Discount() {
  const initial = { price: '', percent: '' }; const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(calculateDiscount(v.price, v.percent)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="Discount result" primary={answer ? money(answer.salePrice) : ''} items={answer ? [{label:'Savings',value:money(answer.savings)},{label:'Original price',value:money(answer.price)},{label:'Discount',value:`${money(answer.percent)}%`}] : []} note="Currency symbols are omitted so you can use the calculator with any currency. Taxes, fees, coupon rules, and retailer rounding may change the final price." />}><form onSubmit={submit} className="space-y-5"><Field id="discount-price" label="Original price" value={v.price} onChange={(value) => update('price', value)} /><Field id="discount-percent" label="Discount (%)" value={v.percent} onChange={(value) => update('percent', value)} />{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset} /></form></CalculatorLayout>
}

function Tax() {
  const initial = { amount: '', rate: '', mode: 'add' }; const [v, setV] = useState(initial); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const update = (key, value) => { setV((current) => ({ ...current, [key]: value })); setError(''); setAnswer(null) }
  const reset = () => { setV(initial); setError(''); setAnswer(null) }
  const submit = (e) => { e.preventDefault(); try { setAnswer(calculateTax(v.amount, v.rate, v.mode)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="Tax result" primary={answer ? `${v.mode === 'add' ? 'Gross' : 'Net'}: ${money(v.mode === 'add' ? answer.gross : answer.net)}` : ''} items={answer ? [{label:'Net amount',value:money(answer.net)},{label:'Tax amount',value:money(answer.tax)},{label:'Gross amount',value:money(answer.gross)},{label:'Rate',value:`${money(answer.rate)}%`}] : []} note="This calculator performs percentage arithmetic only. It does not determine the correct legal tax rate or tax treatment for a transaction." />}><form onSubmit={submit} className="space-y-5"><Segmented label="Calculation" value={v.mode} onChange={(value) => update('mode', value)} options={[{value:'add',label:'Add tax to net'},{value:'extract',label:'Extract tax from gross'}]} /><Field id="tax-amount" label={v.mode === 'add' ? 'Net amount' : 'Tax-inclusive gross amount'} value={v.amount} onChange={(value) => update('amount', value)} /><Field id="tax-rate" label="Tax / VAT rate (%)" value={v.rate} onChange={(value) => update('rate', value)} />{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset} /></form></CalculatorLayout>
}
