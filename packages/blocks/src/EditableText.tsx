'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

type EditableTextProps = {
  value: string
  field: string
  editable?: boolean
  onEdit?: (field: string, value: string) => void
  className?: string
  style?: CSSProperties
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span'
  multiline?: boolean
}

export function EditableText({
  value,
  field,
  editable,
  onEdit,
  className = '',
  style,
  as: Tag = 'span',
  multiline = false,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    const next = draft.trim()
    if (next && next !== value) onEdit?.(field, next)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  const stopBubble = (e: React.SyntheticEvent) => {
    e.stopPropagation()
  }

  if (!editable || !onEdit) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    )
  }

  if (editing) {
    const sharedClass = [
      className,
      'w-full rounded-md border-2 border-[#E63946] bg-white/95 px-2 py-1 text-inherit shadow-sm outline-none',
    ].join(' ')

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          rows={3}
          className={sharedClass}
          style={style}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onClick={stopBubble}
          onMouseDown={stopBubble}
          onKeyDown={(e) => {
            stopBubble(e)
            if (e.key === 'Escape') {
              e.preventDefault()
              cancel()
            }
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              commit()
            }
          }}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        className={sharedClass}
        style={style}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onClick={stopBubble}
        onMouseDown={stopBubble}
        onKeyDown={(e) => {
          stopBubble(e)
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
          if (e.key === 'Escape') {
            e.preventDefault()
            cancel()
          }
        }}
      />
    )
  }

  return (
    <Tag
      className={[
        className,
        'cursor-text rounded-sm transition hover:outline hover:outline-1 hover:outline-[#E63946]/40',
      ].join(' ')}
      style={style}
      title="Double-cliquer pour modifier"
      onDoubleClick={(e) => {
        stopBubble(e)
        setDraft(value)
        setEditing(true)
      }}
      onClick={stopBubble}
      onMouseDown={stopBubble}
    >
      {value}
    </Tag>
  )
}
