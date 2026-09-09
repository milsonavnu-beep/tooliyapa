import Link from 'next/link'
import { ArrowRight, Calculator } from 'lucide-react'

export function CalculatorPageShell({ eyebrow, title, intro, children }) {
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"><header className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-orange-600 dark:text-orange-400">{eyebrow}</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h1><p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{intro}</p></header>{children}</div>
}

export function CalculatorCard({ calculator }) {
  return <Link href={calculator.href} className="group block rounded-2xl border border-orange-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-orange-950 dark:bg-slate-900 dark:hover:border-orange-800"><div className="flex items-start justify-between gap-4"><span className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400"><Calculator className="h-6 w-6" aria-hidden="true" /></span><ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" aria-hidden="true" /></div><h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{calculator.title}</h2><p className="mt-2 leading-6 text-slate-600 dark:text-slate-400">{calculator.description}</p></Link>
}

export function CalculatorField({ id, label, value, onChange, error, hint }) {
  return <div><label htmlFor={id} className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</label><input id={id} name={id} type="text" inputMode="decimal" value={value} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />{hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}{error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}</div>
}

export function CalculatorResult({ result }) {
  return <section aria-live="polite" aria-atomic="true" className="min-w-0 rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25"><p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">Result</p><p className="mt-2 break-words text-3xl font-bold text-slate-900 dark:text-white">{result?.primary || 'Enter values to calculate'}</p>{result && <dl className="mt-5 space-y-4 text-sm"><div><dt className="font-semibold text-slate-800 dark:text-slate-200">Formula</dt><dd className="mt-1 break-words text-slate-600 dark:text-slate-400">{result.formula}</dd></div><div><dt className="font-semibold text-slate-800 dark:text-slate-200">Meaning</dt><dd className="mt-1 leading-6 text-slate-600 dark:text-slate-400">{result.meaning}</dd></div></dl>}</section>
}
