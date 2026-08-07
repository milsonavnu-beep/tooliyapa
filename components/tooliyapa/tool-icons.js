/**
 * Map registry icon ids → Lucide components.
 * Kept out of the registry so metadata stays free of React imports.
 */

import {
  Combine,
  Minimize2,
  Scissors,
  RotateCw,
  Image as ImageIcon,
  FileImage,
  Hash,
  Type,
  Layers,
  Unlock,
  FileText,
  Code,
  RefreshCw,
  Calculator,
  Calendar,
  Sparkles,
  Palette,
  Globe,
  Shield,
} from 'lucide-react'

const ICONS = {
  combine: Combine,
  'minimize-2': Minimize2,
  scissors: Scissors,
  'rotate-cw': RotateCw,
  image: ImageIcon,
  'file-image': FileImage,
  hash: Hash,
  type: Type,
  layers: Layers,
  unlock: Unlock,
  'file-text': FileText,
  code: Code,
  'refresh-cw': RefreshCw,
  calculator: Calculator,
  calendar: Calendar,
  sparkles: Sparkles,
  palette: Palette,
  globe: Globe,
  shield: Shield,
}

export function getToolIcon(iconId) {
  return ICONS[iconId] || FileText
}

export const ACCENT_CLASSES = {
  red: { bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-600', border: 'hover:border-red-300 dark:hover:border-red-700' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600', border: 'hover:border-emerald-300 dark:hover:border-emerald-700' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600', border: 'hover:border-amber-300 dark:hover:border-amber-700' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600', border: 'hover:border-blue-300 dark:hover:border-blue-700' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600', border: 'hover:border-violet-300 dark:hover:border-violet-700' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-600', border: 'hover:border-pink-300 dark:hover:border-pink-700' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-600', border: 'hover:border-orange-300 dark:hover:border-orange-700' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600', border: 'hover:border-cyan-300 dark:hover:border-cyan-700' },
  fuchsia: { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', text: 'text-fuchsia-600', border: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-700' },
  slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'hover:border-slate-300 dark:hover:border-slate-600' },
}

export function getAccentClasses(accent = 'red') {
  return ACCENT_CLASSES[accent] || ACCENT_CLASSES.red
}
