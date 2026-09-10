import { CalculatorPageShell } from '@/components/tooliyapa/CalculatorUI'
import ColorConverter from '@/components/tooliyapa/ColorConverter'
import CustomUnitConverter from '@/components/tooliyapa/CustomUnitConverter'
import EncodingConverter from '@/components/tooliyapa/EncodingConverter'
import UnitConverter from '@/components/tooliyapa/UnitConverter'
import { CONVERTER_PAGES } from '@/lib/converters'
import { createPageMetadata } from '@/lib/site'

export function converterMetadata(id){const config=CONVERTER_PAGES[id];if(!config)throw new Error(`Unknown converter page: ${id}`);return createPageMetadata({title:config.title,description:config.intro,pathname:config.pathname})}

export default function ConverterPage({id}){
  const config=CONVERTER_PAGES[id];if(!config)throw new Error(`Unknown converter page: ${id}`)
  let converter
  if(config.kind==='unit')converter=<UnitConverter tool={id}/>
  else if(config.kind==='custom')converter=<CustomUnitConverter/>
  else if(config.kind==='color')converter=<ColorConverter/>
  else converter=<EncodingConverter tool={id}/>
  return <CalculatorPageShell eyebrow={config.eyebrow} title={config.title} intro={config.intro}>{converter}<article className="mt-12 max-w-4xl space-y-9 text-slate-700 dark:text-slate-300">{config.sections.map(([heading,text])=><section key={heading}><h2 className="text-2xl font-bold text-slate-900 dark:text-white">{heading}</h2><p className="mt-3 leading-7">{text}</p></section>)}<section><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2><div className="mt-4 space-y-4"><div><h3 className="font-semibold text-slate-900 dark:text-white">Does conversion happen in my browser?</h3><p className="mt-1 leading-7">Yes. These value conversions run in the browser and do not require an account.</p></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Should I verify a critical conversion?</h3><p className="mt-1 leading-7">Yes. For engineering, laboratory, medical, financial, legal, or safety-critical work, verify the unit definition and result against an authoritative standard for your context.</p></div></div></section></article></CalculatorPageShell>
}
