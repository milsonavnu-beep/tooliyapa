'use client'

import { useEffect, useId, useState } from 'react'

/**
 * Aesthetic Lottie-style isometric dice logo.
 * Three faces always visible; every 10s the dice opens to reveal
 * PDF / Word / Excel icons, then closes smoothly.
 */
export default function DiceLogo({ size = 36, className = '', title = 'Tooliyapa' }) {
  const s = typeof size === 'number' ? size : 36
  const uid = useId().replace(/:/g, '')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    let openHandle
    let closeHandle
    let cycleHandle

    const close = () => {
      if (cancelled) return
      setOpen(false)
    }

    const openDice = () => {
      if (cancelled) return
      setOpen(true)
      closeHandle = setTimeout(close, 2400)
    }

    // First open after 6.5s, then every 10s from each open
    const scheduleCycle = (delay) => {
      cycleHandle = setTimeout(() => {
        openDice()
        scheduleCycle(10000)
      }, delay)
    }

    scheduleCycle(6500)

    return () => {
      cancelled = true
      clearTimeout(openHandle)
      clearTimeout(closeHandle)
      clearTimeout(cycleHandle)
    }
  }, [])

  return (
    <div
      className={`dice-logo ${open ? 'is-open' : ''} ${className}`}
      style={{ width: s, height: s, ['--dice-size']: `${s}px` }}
      role="img"
      aria-label={title}
    >
      <div className="dice-logo__scene">
        <div className="dice-logo__dice">
          <div className="dice-logo__anchor dice-logo__anchor--front">
            <div className="dice-logo__lid dice-logo__lid--front">
              <div className="dice-logo__face dice-logo__face--front">
                <PipGrid layout="five" />
              </div>
            </div>
          </div>

          <div className="dice-logo__anchor dice-logo__anchor--right">
            <div className="dice-logo__lid dice-logo__lid--right">
              <div className="dice-logo__face dice-logo__face--right">
                <PipGrid layout="three" />
              </div>
            </div>
          </div>

          <div className="dice-logo__anchor dice-logo__anchor--top">
            <div className="dice-logo__lid dice-logo__lid--top">
              <div className="dice-logo__face dice-logo__face--top">
                <PipGrid layout="one" />
              </div>
            </div>
          </div>
        </div>

        {/* 2D overlay — never occluded by 3D face stacking */}
        <div className="dice-logo__reveal" aria-hidden={!open}>
          <div className="dice-logo__icon dice-logo__icon--pdf" title="PDF">
            <FileBadge color="#E53935" letter="P" uid={`${uid}-p`} />
          </div>
          <div className="dice-logo__icon dice-logo__icon--word" title="Word">
            <FileBadge color="#2B579A" letter="W" uid={`${uid}-w`} />
          </div>
          <div className="dice-logo__icon dice-logo__icon--excel" title="Excel">
            <FileBadge color="#217346" letter="X" uid={`${uid}-x`} />
          </div>
        </div>
      </div>
    </div>
  )
}

function PipGrid({ layout }) {
  const maps = {
    one: [4],
    three: [0, 4, 8],
    five: [0, 2, 4, 6, 8],
  }
  const active = new Set(maps[layout] || [4])
  return (
    <div className="dice-logo__pips" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className={active.has(i) ? 'is-on' : ''} />
      ))}
    </div>
  )
}

function FileBadge({ color, letter, uid }) {
  return (
    <svg viewBox="0 0 24 28" className="dice-logo__badge" aria-hidden="true">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M4 1.5h10.5L20 7v17.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2z"
        fill={color}
      />
      <path d="M14.5 1.5V6a1 1 0 0 0 1 1H20" fill="rgba(255,255,255,0.28)" />
      <path
        d="M4 1.5h10.5L20 7v17.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2z"
        fill={`url(#${uid})`}
      />
      <text
        x="11"
        y="19"
        textAnchor="middle"
        fontFamily="ui-rounded, system-ui, sans-serif"
        fontWeight="800"
        fontSize="11"
        fill="#fff"
      >
        {letter}
      </text>
    </svg>
  )
}
