import BasicCalculator from '@/components/tooliyapa/BasicCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Basic Calculator — Arithmetic Operations', description: 'Perform addition, subtraction, multiplication, division, powers, and remainder calculations with finite numeric validation.', pathname: '/calculators/basic' })

export default function Page() {
  return <CalculatorPageShell eyebrow="Math calculator" title="Basic Calculator" intro="Perform everyday arithmetic with two numbers, including addition, subtraction, multiplication, division, powers, and remainders.">
    <BasicCalculator />
    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Supported operations</h2><p className="mt-3 leading-7">The calculator supports addition, subtraction, multiplication, division, exponentiation, and the remainder operation. It evaluates exactly one selected operation between the two entered values, which keeps the calculation explicit and avoids ambiguous expression precedence.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Division and remainder by zero</h2><p className="mt-3 leading-7">Division by zero and a remainder calculation with a zero divisor are undefined, so the calculator rejects those inputs instead of displaying Infinity or NaN.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Powers and large values</h2><p className="mt-3 leading-7">Exponentiation can grow quickly. If a finite pair of inputs produces a result outside JavaScript’s finite number range, the calculator reports that the result cannot be represented rather than displaying an invalid value.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Remainder versus percentage</h2><p className="mt-3 leading-7">The % operation on this page is the remainder after division, often called modulo in everyday calculator software. It is different from calculating a percentage. Use Tooliyapa’s Percentage Calculator for percent-of, percentage change, or increase/decrease questions.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Can I use negative numbers and decimals?</h3><p className="mt-1 leading-7">Yes. Any finite number is accepted, subject to operation-specific restrictions such as a non-zero divisor.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Why are long floating-point results shortened?</h3><p className="mt-1 leading-7">Display formatting removes unnecessary floating-point noise while retaining useful significant digits.</p></div></div></section>
    </article>
  </CalculatorPageShell>
}
