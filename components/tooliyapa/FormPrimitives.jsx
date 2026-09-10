'use client'

export function Field({ id, label, value, onChange, error, hint, type = 'text', inputMode = 'decimal', min, max, step }) {
  return <div><label htmlFor={id} className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</label><input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} inputMode={inputMode} min={min} max={max} step={step} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />{hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}{error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}</div>
}

export function SelectField({ id, label, value, onChange, options, hint }) {
  return <div><label htmlFor={id} className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</label><select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{hint && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}</div>
}

export function Checkbox({ id, label, checked, onChange, hint }) {
  return <label htmlFor={id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"><input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-700" /><span><span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</span>{hint && <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}</span></label>
}

export function Segmented({ value, onChange, options, label }) {
  return <div><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p><div className={`mt-2 grid gap-2 ${options.length <= 2 ? 'grid-cols-2' : options.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>{options.map((option) => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)} className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${value === option.value ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300' : 'border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200'}`}>{option.label}</button>)}</div></div>
}

export function Actions({ submitLabel = 'Calculate', onReset }) {
  return <div className="flex flex-col gap-3 sm:flex-row"><button type="submit" className="min-h-12 flex-1 rounded-xl bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">{submitLabel}</button><button type="button" onClick={onReset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Reset</button></div>
}

export function ResultPanel({ title = 'Result', primary, items = [], note }) {
  return <section aria-live="polite" aria-atomic="true" className="min-w-0 rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900 dark:bg-teal-950/25 sm:p-6"><p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">{title}</p><p className="mt-2 break-words text-3xl font-bold text-slate-900 dark:text-white">{primary || 'Enter values to calculate'}</p>{items.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2">{items.map((item) => <div key={item.label} className="rounded-xl border border-teal-200/80 bg-white/70 p-4 dark:border-teal-900 dark:bg-slate-950/35"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p><p className="mt-1 break-words text-lg font-bold text-slate-900 dark:text-white">{item.value}</p></div>)}</div>}{note && <p className="mt-6 border-t border-teal-200 pt-5 text-sm leading-6 text-slate-600 dark:border-teal-900 dark:text-slate-300">{note}</p>}</section>
}

export function CalculatorLayout({ children, result }) { return <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_.95fr]"><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">{children}</div>{result}</div> }
