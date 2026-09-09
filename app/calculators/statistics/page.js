import StatisticsCalculator from '@/components/tooliyapa/StatisticsCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Statistics Calculator — Mean, Median, Variance & SD', description: 'Calculate mean, median, mode, range, population and sample variance, standard deviation, geometric mean, and harmonic mean.', pathname: '/calculators/statistics' })

export default function Page() {
  return <CalculatorPageShell eyebrow="Statistics" title="Statistics Calculator" intro="Summarize a dataset with central tendency, spread, population and sample statistics, and common specialized means.">
    <StatisticsCalculator />
    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Mean, median, and mode</h2><p className="mt-3 leading-7">The arithmetic mean is the sum divided by the number of observations. The median is the middle ordered value, or the average of the two middle values when the count is even. The mode reports values that repeat most often; if every value occurs only once, this calculator reports no repeated mode.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Range, variance, and standard deviation</h2><p className="mt-3 leading-7">Range is maximum minus minimum. Variance measures average squared distance from the mean, and standard deviation is the square root of variance. This calculator uses a numerically stable one-pass variance algorithm to reduce avoidable rounding loss.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Population versus sample statistics</h2><p className="mt-3 leading-7">Population variance divides by N when your values are the full population of interest. Sample variance divides by N − 1 when the values are treated as a sample used to estimate a broader population. Sample variance and sample standard deviation are therefore undefined for a one-value dataset.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Geometric and harmonic means</h2><p className="mt-3 leading-7">The geometric mean is useful for multiplicative rates or proportional growth, while the harmonic mean is often useful for rates where equal quantities are involved. This tool reports both only when every input is strictly positive, avoiding ambiguous or non-real cases.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interpreting descriptive statistics</h2><p className="mt-3 leading-7">These results describe the values you enter; they do not by themselves establish causation, statistical significance, representativeness, or a valid sampling design. Domain context still matters.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Can values be negative?</h3><p className="mt-1 leading-7">Yes for the ordinary descriptive statistics. Geometric and harmonic means are withheld unless all values are positive.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Can I paste values from a spreadsheet?</h3><p className="mt-1 leading-7">Yes, as long as the pasted values are separated by spaces, commas, or line breaks and contain only finite numbers.</p></div></div></section>
    </article>
  </CalculatorPageShell>
}
