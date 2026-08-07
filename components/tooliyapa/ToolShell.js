'use client'

import ToolPrivacyBadge from '@/components/tooliyapa/ToolPrivacyBadge'
import { getAccentClasses } from '@/components/tooliyapa/tool-icons'

/**
 * Tool UI chrome: icon, H1, description, privacy badge, children.
 * Outer page container / breadcrumbs / FAQ live in ToolPageLayout.
 */
export default function ToolShell({
  icon: Icon,
  title,
  description,
  accent = 'red',
  processing = 'browser-local',
  showPrivacy = true,
  children,
}) {
  const c = getAccentClasses(accent)
  return (
    <div className="container mx-auto px-4 pb-2 max-w-4xl">
      <div className="text-center mb-8">
        <div className={`inline-flex w-14 h-14 rounded-2xl ${c.bg} items-center justify-center mb-4`}>
          <Icon className={`w-7 h-7 ${c.text}`} aria-hidden="true" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50">{title}</h1>
        {description && <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>}
        {showPrivacy && (
          <div className="mt-4 flex justify-center">
            <ToolPrivacyBadge processing={processing} />
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
