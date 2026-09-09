import FractionCalculator from '@/components/tooliyapa/FractionCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Fraction Calculator — Exact Arithmetic & Simplification', description: 'Add, subtract, multiply, divide, simplify, and convert fractions to mixed numbers, decimals, and percentages using exact integer arithmetic.', pathname: '/calculators/fraction' })

export default function Page() {
  return <CalculatorPageShell eyebrow="Math calculator" title="Fraction Calculator" intro="Work with fractions using exact integer arithmetic, then view simplified, mixed-number, decimal, and percentage forms.">
    <FractionCalculator />
    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Exact fraction arithmetic</h2><p className="mt-3 leading-7">The core fraction operations use integer arithmetic rather than converting the fractions to ordinary floating-point decimals first. This preserves exact numerators and denominators for addition, subtraction, multiplication, division, and simplification.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">How fractions are simplified</h2><p className="mt-3 leading-7">The numerator and denominator are divided by their greatest common divisor. A negative sign is normalized to the numerator and the denominator is kept positive, so equivalent forms such as 2/4 and −2/−4 reduce consistently.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Adding and subtracting fractions</h2><p className="mt-3 leading-7">Fractions with different denominators are cross-multiplied to a common denominator before the numerators are combined. The final result is then simplified automatically.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Decimal and percentage conversions</h2><p className="mt-3 leading-7">Conversion happens after the exact fraction is known. Terminating decimals are shown without unnecessary zeros. Repeating or longer decimals are limited to a practical number of places and marked with an ellipsis so a truncated decimal is not mistaken for an exact finite representation.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Input limits and zero denominators</h2><p className="mt-3 leading-7">Numerators and denominators must be whole integers. Zero is valid as a numerator but never as a denominator, and division by a zero fraction is rejected. Individual integer inputs are limited to 100 digits to keep browser calculations responsive.</p></section>
      <section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Can I enter negative fractions?</h3><p className="mt-1 leading-7">Yes. A negative numerator or denominator is accepted and the sign is normalized in the result.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Why are decimal inputs not accepted?</h3><p className="mt-1 leading-7">This page treats a fraction as an exact ratio of two whole integers. Use the decimal display to convert an exact fraction after calculation.</p></div></div></section>
    </article>
  </CalculatorPageShell>
}
