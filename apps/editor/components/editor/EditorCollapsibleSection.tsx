'use client'

import { useState, type ReactNode } from 'react'
import { editorPanel } from './editor-panel-theme'

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
    <section className={editorPanel.section}>
      <button
        type="button"
        onClick={toggle}
        className={editorPanel.sectionButton}
        aria-expanded={open}
      >
        <h2 className={editorPanel.sectionTitle}>{title}</h2>
        <span className={editorPanel.sectionToggle} aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      {open ? <div className={editorPanel.sectionBody}>{children}</div> : null}
    </section>
  )
}
