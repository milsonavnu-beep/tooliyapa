import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import { ConverterCard } from '@/components/tooliyapa/ConverterUI'
import { AVAILABLE_CONVERTERS } from '@/lib/converters'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Free Online Converters', description: 'Convert everyday units, number systems, text encodings, colors, and electrical quantities with browser-based Tooliyapa converters.', pathname: '/converters' })
const GROUP_ORDER=['Everyday Units','Number & Encoding','Color','Electrical']

export default function Page(){const groups=GROUP_ORDER.map((name)=>({name,tools:AVAILABLE_CONVERTERS.filter((tool)=>tool.subcategory===name)})).filter((group)=>group.tools.length);return <CalculatorPageShell eyebrow="Converters" title="Free Online Converters" intro="Convert units, number formats, encodings, colors, and electrical quantities with clear definitions and validation."><div className="mt-8 flex flex-wrap items-center gap-3"><span className="rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300">{AVAILABLE_CONVERTERS.length} converters available</span><span className="text-sm text-slate-500 dark:text-slate-400">No account required.</span></div><div className="mt-10 space-y-12">{groups.map((group)=><section key={group.name}><h2 className="text-2xl font-bold text-slate-900 dark:text-white">{group.name}</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{group.tools.map((converter)=><ConverterCard key={converter.id} converter={converter}/>)}</div></section>)}</div></CalculatorPageShell>}
