import InterestCalculator from '@/components/tooliyapa/InterestCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Interest Calculator — Simple, Compound & APY',
  description: 'Calculate simple interest, compound interest, APY, and the future value of recurring end-of-period contributions.',
  pathname: '/calculators/interest',
})

export default function Page() {
  return <CalculatorPageShell eyebrow="Finance calculator" title="Interest Calculator" intro="Compare simple and compound interest, see effective annual yield, and estimate how recurring contributions can change future value.">
    <InterestCalculator />
    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Simple interest versus compound interest</h2><p className="mt-3 leading-7">Simple interest is calculated only from the starting principal. Compound interest adds interest to the balance, so later periods can earn interest on earlier interest as well. The difference becomes more noticeable as the rate, compounding frequency, or time increases.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">How compound interest is calculated</h2><p className="mt-3 leading-7">For a lump sum, the calculator applies the periodic rate to the balance for each compounding period. When recurring contributions are entered, each contribution is treated as an ordinary payment made at the end of its period. That timing matters: deposits made at the beginning of each period would produce a different result.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">What APY means</h2><p className="mt-3 leading-7">Annual percentage yield expresses the effective annual growth produced by a nominal annual rate after compounding. Two accounts with the same nominal rate can have different APYs if they compound at different frequencies.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recurring contributions</h2><p className="mt-3 leading-7">The contribution field is per compounding period. With monthly compounding it represents a monthly contribution; with quarterly compounding it represents a quarterly contribution. Keep the contribution frequency aligned with the selected compounding frequency.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Important assumptions</h2><p className="mt-3 leading-7">Rates are treated as fixed nominal annual rates, compounding occurs at the selected frequency, and contributions occur at the end of each period. Taxes, account fees, rate changes, inflation, market losses, and irregular deposit timing are not included.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Can I calculate a 0% rate?</h3><p className="mt-1 leading-7">Yes. At a 0% rate the future value is the starting principal plus any recurring contributions.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Why might a bank or investment statement differ?</h3><p className="mt-1 leading-7">Real products can use daily balance methods, different day-count conventions, fees, taxes, variable rates, or different contribution timing.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Is this investment advice?</h3><p className="mt-1 leading-7">No. It is a mathematical planning estimate and not financial, tax, or investment advice.</p></div></div></section>
    </article>
  </CalculatorPageShell>
}
