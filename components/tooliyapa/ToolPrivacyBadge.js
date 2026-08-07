import { Lock } from 'lucide-react'

/**
 * Precise privacy indicator for browser-local tools.
 * Does NOT claim "no tracking" (AdSense may load).
 */
export default function ToolPrivacyBadge({
  processing = 'browser-local',
  className = '',
}) {
  if (processing !== 'browser-local') return null

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-medium ${className}`}
      role="status"
    >
      <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>Processed in your browser · files aren&apos;t uploaded to Tooliyapa servers</span>
    </div>
  )
}
