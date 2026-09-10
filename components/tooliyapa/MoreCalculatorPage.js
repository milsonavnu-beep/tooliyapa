import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import DateTimeCalculator from '@/components/tooliyapa/DateTimeCalculator'
import FinanceExtraCalculator from '@/components/tooliyapa/FinanceExtraCalculator'
import GpaCalculator from '@/components/tooliyapa/GpaCalculator'
import HealthCalculator from '@/components/tooliyapa/HealthCalculator'
import MathExtraCalculator from '@/components/tooliyapa/MathExtraCalculator'
import { MORE_CALCULATOR_PAGES } from '@/lib/more-calculator-pages'
import { createPageMetadata } from '@/lib/site'

const MATH = new Set(['scientific','lcm-gcf','quadratic','base-arithmetic','random-number'])
const FINANCE = new Set(['discount','tax'])
const HEALTH = new Set(['bmi','bmr','ideal-weight'])
const DATE = new Set(['age','date-difference','countdown','time-duration'])

export function calculatorMetadata(id) {
  const config = MORE_CALCULATOR_PAGES[id]
  if (!config) throw new Error(`Unknown calculator page: ${id}`)
  return createPageMetadata({ title: config.title, description: config.description, pathname: config.pathname })
}

export default function MoreCalculatorPage({ id }) {
  const config = MORE_CALCULATOR_PAGES[id]
  if (!config) throw new Error(`Unknown calculator page: ${id}`)
  let calculator
  if (MATH.has(id)) calculator = <MathExtraCalculator tool={id} />
  else if (FINANCE.has(id)) calculator = <FinanceExtraCalculator tool={id} />
  else if (HEALTH.has(id)) calculator = <HealthCalculator tool={id} />
  else if (DATE.has(id)) calculator = <DateTimeCalculator tool={id} />
  else calculator = <GpaCalculator />
  return <CalculatorPageShell eyebrow={config.eyebrow} title={config.title} intro={config.intro}>{calculator}<article className="mt-12 max-w-4xl space-y-9 text-slate-700 dark:text-slate-300">{config.sections.map(([heading,text])=><section key={heading}><h2 className="text-2xl font-bold text-slate-900 dark:text-white">{heading}</h2><p className="mt-3 leading-7">{text}</p></section>)}<section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-4"><div><h3 className="font-semibold text-slate-900 dark:text-white">Are results saved or uploaded?</h3><p className="mt-1 leading-7">The calculation runs in your browser. Tooliyapa does not require an account to use this calculator.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Should I verify an important result?</h3><p className="mt-1 leading-7">Yes. For financial, health, academic, engineering, legal, or other consequential decisions, verify the inputs, assumptions, and result against an appropriate authoritative source or qualified professional.</p></div></div></section></article></CalculatorPageShell>
}
