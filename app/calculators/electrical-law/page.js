import ElectricalCalculator from '@/components/tooliyapa/ElectricalCalculator'
import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Electrical Calculator — Ohm’s Law & Power',
  description: 'Calculate voltage, current, resistance, and power from any supported pair using Ohm’s Law and ideal resistive power formulas.',
  pathname: '/calculators/electrical-law',
})

export default function Page() {
  return <CalculatorPageShell eyebrow="Electrical calculator" title="Electrical Calculator" intro="Use two known electrical values to derive voltage, current, resistance, and power with Ohm’s Law and ideal resistive power relationships.">
    <ElectricalCalculator />

    <article className="mt-12 max-w-4xl space-y-10 text-slate-700 dark:text-slate-300">
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ohm’s Law</h2>
        <p className="mt-3 leading-7">Ohm’s Law relates voltage, current, and resistance: V = I × R. Rearranging the same relationship gives I = V ÷ R and R = V ÷ I. If any two of these quantities are known for an ideal resistive circuit, the third can be calculated.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Electrical power</h2>
        <p className="mt-3 leading-7">For ideal DC or purely resistive conditions, electrical power is P = V × I. Combining this with Ohm’s Law also gives P = I²R and P = V² ÷ R. Those equivalent forms allow the calculator to solve all four quantities from several different known-value pairs.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What the calculator can solve</h2>
        <p className="mt-3 leading-7">Choose voltage and current, voltage and resistance, voltage and power, current and resistance, current and power, or resistance and power. The calculator derives the remaining quantities and shows the formula path used.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Units</h2>
        <p className="mt-3 leading-7">Enter base SI units: volts (V), amperes (A), ohms (Ω), and watts (W). For example, convert 250 mA to 0.25 A and 4.7 kΩ to 4700 Ω before entering the values. The outputs are also shown in these base units.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AC circuits and power factor</h2>
        <p className="mt-3 leading-7">Real AC circuits can include reactance, impedance, phase angle, apparent power, reactive power, and power factor. This calculator does not model those effects, so the simple P = V × I relationship should not be treated as a complete AC power calculation unless the circuit is appropriately resistive and the assumptions apply.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Safety and design limitations</h2>
        <p className="mt-3 leading-7">This page is a formula calculator, not an electrical design or safety tool. It does not size conductors, breakers, fuses, insulation, enclosures, grounding, thermal limits, or protective devices. Follow applicable electrical codes, manufacturer data, and qualified professional guidance for real installations.</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
        <div className="mt-4 space-y-5"><div><h3 className="font-semibold text-slate-900 dark:text-white">Why must the inputs be greater than zero?</h3><p className="mt-1 leading-7">Several inverse formulas divide by a known quantity. Restricting inputs to positive values avoids zero-division and degenerate cases where the remaining values are not uniquely determined.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Can I enter milliamps or kilohms directly?</h3><p className="mt-1 leading-7">Convert them first: divide milliamps by 1000 to get amperes, and multiply kilohms by 1000 to get ohms.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Does this work for three-phase power?</h3><p className="mt-1 leading-7">No. Three-phase systems require different formulas and often power-factor information, so they are outside this calculator’s scope.</p></div></div>
      </section>
    </article>
  </CalculatorPageShell>
}
