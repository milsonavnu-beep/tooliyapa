import Link from 'next/link'
import { ArrowLeftRight, ArrowRight } from 'lucide-react'

export function ConverterCard({ converter }) {
  return <Link href={converter.href} className="group block rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-cyan-950 dark:bg-slate-900 dark:hover:border-cyan-800"><div className="flex items-start justify-between gap-4"><span className="rounded-xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300"><ArrowLeftRight className="h-6 w-6" aria-hidden="true" /></span><ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" aria-hidden="true" /></div><h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{converter.title}</h2><p className="mt-2 leading-6 text-slate-600 dark:text-slate-400">{converter.description}</p></Link>
}
