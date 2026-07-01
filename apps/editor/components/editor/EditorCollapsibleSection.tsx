'use client'

import { useState, type ReactNode } from 'react'

const SECTION_STORAGE_PREFIX = 'lp-studio-section-open:'

type EditorCollapsibleSectionProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  storageKey?: string
}

function readStoredOpen(storageKey: string | undefined, defaultOpen: boolean): boolean {
  if (!storageKey || typeof window === 'undefined') return defaultOpen
  const stored = localStorage.getItem(`${SECTION_STORAGE_PREFIX}${storageKey}`)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return defaultOpen
}

export function EditorCollapsibleSection({
  title,
  children,
  defaultOpen = true,
  storageKey,
}: EditorCollapsibleSectionProps) {
  const [open, setOpen] = useState(() => readStoredOpen(storageKey, defaultOpen))

  const toggle = () => {
    setOpen((current) => {
      const next = !current
      if (storageKey) {
        localStorage.setItem(`${SECTION_STORAGE_PREFIX}${storageKey}`, String(next))
      }
      return next
    })
  }

  return (
    <section className="border-b border-gray-200">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 border-b border-[#1A3066]/10 bg-[#E3F2FD]/40 px-4 py-3 text-left transition hover:bg-[#E3F2FD]/70"
        aria-expanded={open}
      >
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1A3066]">{title}</h2>
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#1A3066]/20 bg-white text-base font-bold leading-none text-[#1A3066]"
          aria-hidden
        >
          {open ? '−' : '+'}
        </span>
      </button>
      {open ? children : null}
    </section>
  )
}
