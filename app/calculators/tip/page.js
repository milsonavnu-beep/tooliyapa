import TipCalculator from '@/components/tooliyapa/TipCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Tip Calculator — Gratuity & Bill Split', description: 'Calculate tip amount, total bill, tip per person, and total per person using a custom gratuity percentage.', pathname: '/calculators/tip' })

export default function Page() {
  return <CalculatorPageShell eyebrow="Everyday calculator" title="Tip Calculator" intro="Calculate gratuity, total bill, and an even per-person split with a custom or common tip percentage.">
    <TipCalculator />
    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">How the tip is calculated</h2><p className="mt-3 leading-7">Tip amount equals the bill amount multiplied by the tip percentage. The total is the original bill plus that tip. If you enter more than one person, the calculator divides both the tip and total evenly.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Choosing a tip percentage</h2><p className="mt-3 leading-7">The preset buttons are convenience shortcuts, not recommendations. Tipping customs vary by country, venue, service type, and whether a service charge is already included. You can type any non-negative percentage instead.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Splitting a bill</h2><p className="mt-3 leading-7">This tool assumes an equal split. If people ordered different amounts or want different tip shares, calculate those portions separately rather than treating the even split as an exact settlement.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Service charges and taxes</h2><p className="mt-3 leading-7">The calculator only uses the bill amount you enter. Check the receipt for mandatory service charges or included gratuity before adding another tip. Whether you tip on a pre-tax or post-tax amount is a personal or local-practice decision; enter the base you intend to use.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Can I enter a 0% tip?</h3><p className="mt-1 leading-7">Yes. The total then remains equal to the entered bill amount.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Does the tool round each person separately?</h3><p className="mt-1 leading-7">The underlying calculation keeps normal floating-point precision; displayed values are rounded to at most two decimal places.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Can I use any currency?</h3><p className="mt-1 leading-7">Yes. The calculator is currency-neutral because it only performs arithmetic on the amounts you enter.</p></div></div></section>
    </article>
  </CalculatorPageShell>
}
