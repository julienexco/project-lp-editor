'use client'

import { useEffect, useRef, useState } from 'react'

type EditablePageTitleProps = {
  value: string
  onChange: (value: string) => void
}

export function EditablePageTitle({ value, onChange }: EditablePageTitleProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const commit = () => {
    const next = draft.trim()
    if (next && next !== value) onChange(next)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
          if (e.key === 'Escape') {
            e.preventDefault()
            cancel()
          }
        }}
        className="w-full min-w-0 rounded-md border-2 border-white/40 bg-white/10 px-2 py-0.5 text-lg font-semibold text-white outline-none ring-0 placeholder:text-white/50 focus:border-white/70 focus:bg-white/15"
        aria-label="Nom de la page"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="block max-w-full truncate rounded-md px-1 py-0.5 text-left text-lg font-semibold text-white transition hover:bg-white/10"
      title="Cliquer pour renommer la page"
    >
      {value}
    </button>
  )
}
