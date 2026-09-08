import { CalculatorCard, CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { AVAILABLE_CALCULATORS } from '@/lib/calculators'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Free Online Calculators', description: 'Use Tooliyapa’s available browser-based calculator for practical everyday percentage calculations, with more tools added over time.', pathname: '/calculators' })

export default function Page() {
  return <CalculatorPageShell eyebrow="Calculators" title="Free Online Calculators" intro="Tooliyapa is beginning to provide practical browser-based calculators for everyday math, finance, planning, and related tasks."><div className="mt-8 flex items-center gap-3"><span className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800 dark:bg-teal-950/50 dark:text-teal-300">{AVAILABLE_CALCULATORS.length} calculator available</span><span className="text-sm text-slate-500 dark:text-slate-400">More calculators are being added over time.</span></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{AVAILABLE_CALCULATORS.map((calculator) => <CalculatorCard key={calculator.id} calculator={calculator} />)}</div></CalculatorPageShell>
}
