import RatioCalculator from '@/components/tooliyapa/RatioCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Ratio Calculator — Simplify, Proportion & Split',
  description: 'Simplify ratios, solve proportions exactly, and split totals by a ratio with clear formulas and validation.',
  pathname: '/calculators/ratio',
})

export default function Page() {
  return <CalculatorPageShell eyebrow="Math calculator" title="Ratio Calculator" intro="Simplify ratios, solve a proportion for an unknown value, or divide a total according to a ratio.">
    <RatioCalculator />

    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How to simplify a ratio</h2>
        <p className="mt-3 leading-7">A ratio such as 12 : 18 compares two quantities. To simplify it, divide both terms by their greatest common divisor. Since the greatest common divisor of 12 and 18 is 6, the simplified ratio is 2 : 3. The calculator uses exact whole-integer arithmetic for this step.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Solving proportions</h2>
        <p className="mt-3 leading-7">A proportion states that two ratios are equal. For a : b = c : x, cross-multiplication gives a × x = b × c. Rearranging gives x = (b × c) ÷ a. If x is not a whole number, this calculator keeps the exact fractional answer and also shows a decimal form.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Splitting a total by ratio</h2>
        <p className="mt-3 leading-7">To divide a total in the ratio 2 : 3, first add the parts to get 5. The first share is 2/5 of the total and the second share is 3/5. This is useful for budgets, mixtures, allocations, ownership shares, and other proportional distributions.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why exact integer arithmetic matters</h2>
        <p className="mt-3 leading-7">Ratio simplification and proportion solving use integer-based arithmetic instead of truncating values to ordinary JavaScript integers. That keeps large whole-number ratios exact and avoids silently losing precision during the simplification step.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Common mistakes</h2>
        <div className="mt-4 space-y-4 leading-7"><p><strong className="text-slate-900 dark:text-white">Reversing the order:</strong> 2 : 3 and 3 : 2 represent different comparisons, so preserve the order of the quantities.</p><p><strong className="text-slate-900 dark:text-white">Using a zero denominator:</strong> a ratio interpreted as a fraction cannot have zero as its second term in simplify or proportion mode.</p><p><strong className="text-slate-900 dark:text-white">Using negative split weights:</strong> splitting a practical total requires positive ratio parts because each part represents a positive share of the whole.</p></div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
        <div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Can a simplified ratio contain a negative term?</h3><p className="mt-1 leading-7">Yes. Negative ratios are accepted in simplify mode. The sign is normalized so the second term is positive.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Can the proportion answer be a fraction?</h3><p className="mt-1 leading-7">Yes. The exact fractional result is preserved instead of being rounded to a whole number.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Does ratio splitting round the shares?</h3><p className="mt-1 leading-7">The calculator keeps the underlying numeric result and formats it for readability. Depending on the ratio, displayed shares can contain decimals.</p></div></div>
      </section>
    </article>
  </CalculatorPageShell>
}
