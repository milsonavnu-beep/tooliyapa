import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

/**
 * Accessible breadcrumbs. Prefer registry-built items.
 * @param {{ items: { name: string, href?: string }[] }} props
 */
export default function ToolBreadcrumbs({ items = [] }) {
  if (!items.length) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.name}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden="true" />}
              {isLast || !item.href ? (
                <span className="font-medium text-gray-800 dark:text-gray-200" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors underline-offset-2 hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function toolBreadcrumbItems(tool, category) {
  return [
    { name: 'Home', href: '/' },
    ...(category ? [{ name: category.name, href: category.href }] : []),
    { name: tool.name },
  ]
}

export function categoryBreadcrumbItems(category) {
  return [
    { name: 'Home', href: '/' },
    { name: category.name },
  ]
}
