import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import PercentageCalculator from '@/components/tooliyapa/PercentageCalculator'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Percentage Calculator – Percent Change, Increase & Decrease', description: 'Calculate percentages, find what percent one number is of another, measure percentage change, and increase or decrease values by a percentage.', pathname: '/calculators/percentage' })

const Section = ({ title, children }) => <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70"><h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2><div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{children}</div></section>

export default function Page() {
  return <CalculatorPageShell eyebrow="Calculators" title="Percentage Calculator" intro="Calculate a percentage of a number, compare one value with another, measure change, or adjust a value—all on one page."><PercentageCalculator /><div className="mt-14 grid gap-5 md:grid-cols-2">
    <Section title="What is a percentage?"><p>A percentage describes a quantity per hundred. For example, 20% means 20 out of every 100, or 0.2 as a decimal.</p></Section>
    <Section title="Percentage formulas"><ul className="list-disc space-y-2 pl-5"><li>Percent of a number: value × percent ÷ 100.</li><li>What percent: part ÷ whole × 100.</li><li>Percentage change: (new − old) ÷ old × 100.</li></ul></Section>
    <Section title="How to calculate a percentage of a number"><p>Convert the percentage to a decimal by dividing by 100, then multiply by the number. Thus, 20% of 150 is 150 × 20 ÷ 100 = 30.</p></Section>
    <Section title="How to find what percentage one number is of another"><p>Divide the part by the whole and multiply by 100. For example, 45 ÷ 300 × 100 = 15%. The whole cannot be zero.</p></Section>
    <Section title="How percentage change works"><p>Subtract the starting value from the new value, divide by the starting value, and multiply by 100. This calculator requires a positive starting value so the interpretation remains clear.</p></Section>
    <Section title="Percentage increase vs decrease"><p>An increase adds the percentage portion to the base; a decrease subtracts it. A decrease above 100% can cross zero and produce a negative result.</p></Section>
    <Section title="Practical examples"><p>A price of 200 increased by 12.5% becomes 225. The same base decreased by 12.5% becomes 175. A value moving from 50 to 75 is a 50% increase.</p></Section>
    <Section title="Common mistakes"><p>Do not confuse a percentage change with a percentage-point change. Check which value is the whole, and remember that reversing old and new values changes the result.</p></Section>
    <Section title="Frequently asked questions"><h3 className="font-semibold text-slate-900 dark:text-white">Can a percentage exceed 100%?</h3><p>Yes. It can describe a quantity larger than the reference amount. Percentage inputs can exceed 100 where the operation makes mathematical sense.</p><h3 className="font-semibold text-slate-900 dark:text-white">Are decimals supported?</h3><p>Yes. You can enter decimal values in every mode.</p></Section>
  </div></CalculatorPageShell>
}
