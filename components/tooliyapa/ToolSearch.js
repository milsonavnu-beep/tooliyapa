'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { searchTools } from '@/lib/tools/search'
import { getActiveTools } from '@/lib/tools/registry'
import { getToolIcon } from '@/components/tooliyapa/tool-icons'

/**
 * Client-side tool search over registry metadata.
 * No server calls, no external search APIs.
 */
export default function ToolSearch({
  placeholder = 'Search tools…',
  className = '',
  autoFocus = false,
  onNavigate,
  compact = false,
}) {
  const router = useRouter()
  const inputId = useId()
  const listId = useId()
  const rootRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const tools = useMemo(() => getActiveTools(), [])
  const results = useMemo(() => (query.trim() ? searchTools(query, { tools, limit: 8 }) : []), [query, tools])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const go = (tool) => {
    if (!tool) return
    setOpen(false)
    setQuery('')
    onNavigate?.(tool)
    router.push(tool.href)
  }

  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter') && results.length) {
      setOpen(true)
    }
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[activeIndex] || results[0])
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        Search tools
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={results[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-9 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 ${
            compact ? 'h-9' : 'h-11'
          }`}
        />
        {query ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              setOpen(false)
            }}
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {open && query.trim() && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="absolute z-50 mt-2 w-full max-h-80 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-1"
        >
          {results.length === 0 ? (
            <li className="px-3 py-3 text-sm text-gray-500">No tools match “{query.trim()}”.</li>
          ) : (
            results.map((tool, index) => {
              const Icon = getToolIcon(tool.icon)
              const active = index === activeIndex
              return (
                <li key={tool.id} role="option" id={`${listId}-opt-${index}`} aria-selected={active}>
                  <button
                    type="button"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm ${
                      active ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(tool)}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="font-medium block truncate">{tool.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                        {tool.shortDescription}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
