'use client'

import { useId, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { PDF_TOOLS } from '@/lib/tools'

export default function ToolSearch({ compact = false, className = '' }) {
  const router = useRouter()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    if (!terms.length) return []
    return PDF_TOOLS.filter((tool) => terms.every((term) => `${tool.title} ${tool.keywords}`.toLowerCase().includes(term)))
  }, [query])

  const navigate = (href) => {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  return (
    <div className={`relative ${className}`} role="search">
      <label htmlFor={listId} className="sr-only">Search current tools</label>
      <Search className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 ${compact ? 'h-4 w-4' : 'h-5 w-5'}`} aria-hidden="true" />
      <input
        id={listId}
        type="search"
        value={query}
        placeholder="Search tools..."
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={`${listId}-results`}
        aria-expanded={open && query.length > 0}
        aria-activedescendant={open && results[active] ? `${listId}-result-${active}` : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(event) => { setQuery(event.target.value); setActive(0); setOpen(true) }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') { setOpen(false); event.currentTarget.blur() }
          if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); setActive((value) => (value + 1) % results.length) }
          if (event.key === 'ArrowUp' && results.length) { event.preventDefault(); setActive((value) => (value - 1 + results.length) % results.length) }
          if (event.key === 'Enter' && results.length) { event.preventDefault(); navigate(results[active]?.href || results[0].href) }
        }}
        className={`w-full rounded-xl border border-slate-200 bg-white text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${compact ? 'h-10 pl-9 pr-3 text-sm' : 'h-14 pl-11 pr-4 text-base shadow-sm'}`}
      />
      {open && query && (
        <div id={`${listId}-results`} role="listbox" className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {results.length ? results.map((tool, index) => (
            <button
              key={tool.href}
              id={`${listId}-result-${index}`}
              type="button"
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => navigate(tool.href)}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium outline-none ${index === active ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200' : 'text-slate-700 dark:text-slate-200'}`}
            >
              {tool.title}
            </button>
          )) : <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No current tools found.</p>}
        </div>
      )}
    </div>
  )
}
