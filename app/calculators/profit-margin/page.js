import ProfitMarginCalculator from '@/components/tooliyapa/ProfitMarginCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Profit Margin Calculator — Margin, Markup & Profit', description: 'Calculate profit margin, markup, profit per unit, total revenue, total cost, and total profit from cost and selling price.', pathname: '/calculators/profit-margin' })

export default function Page() {
  return <CalculatorPageShell eyebrow="Business calculator" title="Profit Margin Calculator" intro="Turn cost and selling price into margin, markup, profit per unit, and business totals without confusing margin with markup.">
    <ProfitMarginCalculator />
    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profit, margin, and markup</h2><p className="mt-3 leading-7">Profit per unit is selling price minus cost. Profit margin compares that profit with the selling price, while markup compares it with the cost. Because the denominators differ, a 50% markup does not mean a 50% margin.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">How profit margin is calculated</h2><p className="mt-3 leading-7">Margin percentage equals profit divided by selling price, multiplied by 100. A positive margin means the selling price is above the entered cost; a negative margin means it is below that cost.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">How markup is calculated</h2><p className="mt-3 leading-7">Markup percentage equals profit divided by cost, multiplied by 100. If cost is exactly zero, markup is undefined because division by zero has no finite percentage result; the calculator reports that explicitly instead of inventing a value.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Using quantity for totals</h2><p className="mt-3 leading-7">Quantity scales the per-unit numbers into total revenue, total cost, and total profit. It does not change the margin or markup percentages because both percentages are based on the same unit economics.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">What to include in cost</h2><p className="mt-3 leading-7">The result only reflects the cost you enter. Depending on your use case, a meaningful cost may need to include purchase cost, materials, packaging, commissions, shipping, or allocated overhead. This calculator does not decide which accounting definition is appropriate for your business.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Can margin be negative?</h3><p className="mt-1 leading-7">Yes. If selling price is lower than the entered cost, the unit profit and margin are negative.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Why is markup undefined when cost is zero?</h3><p className="mt-1 leading-7">Markup divides profit by cost. A zero cost makes that ratio undefined.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Does this include taxes or fees?</h3><p className="mt-1 leading-7">Only if you deliberately include them in the cost or selling price values you enter.</p></div></div></section>
    </article>
  </CalculatorPageShell>
}
