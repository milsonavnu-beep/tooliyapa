import { CalculatorCard, CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { AVAILABLE_CALCULATORS } from '@/lib/calculators'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Free Online Calculators', description: 'Use Tooliyapa’s practical browser-based calculators for math, finance, health references, date and time, education, and electrical calculations.', pathname: '/calculators' })

const GROUP_ORDER = ['Math','Finance','Everyday','Education','Date & Time','Electrical & Physics','Health']

export default function Page() {
  const groups = GROUP_ORDER.map((name)=>({name,tools:AVAILABLE_CALCULATORS.filter((tool)=>tool.subcategory===name)})).filter((group)=>group.tools.length)
  return <CalculatorPageShell eyebrow="Calculators" title="Free Online Calculators" intro="Use practical browser-based calculators for math, finance, everyday tasks, education, dates, electrical formulas, and clearly framed health references."><div className="mt-8 flex flex-wrap items-center gap-3"><span className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800 dark:bg-teal-950/50 dark:text-teal-300">{AVAILABLE_CALCULATORS.length} calculators available</span><span className="text-sm text-slate-500 dark:text-slate-400">Grouped by purpose for faster browsing.</span></div><div className="mt-10 space-y-12">{groups.map((group)=><section key={group.name}><h2 className="text-2xl font-bold text-slate-900 dark:text-white">{group.name}</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{group.tools.map((calculator)=><CalculatorCard key={calculator.id} calculator={calculator}/>)}</div></section>)}</div></CalculatorPageShell>
}
