'use client'

import { useEffect, useRef, useState } from 'react'
import type { BlockInstance, BlockType } from '@lp-studio/types'
import type { blockRegistry } from '@lp-studio/registry'
import { getBlockLabel } from '@lp-studio/registry'
import { editorPanel } from './editor-panel-theme'

type BlockListProps = {
  blocks: BlockInstance[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRename: (id: string, label: string | undefined) => void
  registry: typeof blockRegistry
}

export function BlockList({ blocks, selectedId, onSelect, onRename, registry }: BlockListProps) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId) inputRef.current?.select()
  }, [editingId])

  const startEditing = (block: BlockInstance) => {
    setEditingId(block.id)
    setDraft(getBlockLabel(block, registry))
  }

  const commitRename = (block: BlockInstance) => {
    const next = draft.trim()
    const current = getBlockLabel(block, registry)
    if (next && next !== current) {
      onRename(block.id, next)
    } else if (!next && block.label) {
      onRename(block.id, undefined)
    }
    setEditingId(null)
  }

  const cancelRename = (block: BlockInstance) => {
    setDraft(getBlockLabel(block, registry))
    setEditingId(null)
  }

  return (
    <ul className="space-y-2 px-4 py-4">
      {sorted.map((block) => {
        const displayLabel = getBlockLabel(block, registry)
        const active = block.id === selectedId
        const editing = editingId === block.id

        return (
          <li key={block.id}>
            {editing ? (
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => commitRename(block)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    commitRename(block)
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    cancelRename(block)
                  }
                }}
                className={[
                  'w-full rounded-xl border px-3 py-2.5 text-sm font-medium outline-none ring-2 ring-[#E63946]/40',
                  active ? editorPanel.blockActive : editorPanel.block,
                ].join(' ')}
                aria-label="Nom du bloc"
              />
            ) : (
              <button
                type="button"
                onClick={() => onSelect(block.id)}
                onDoubleClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  startEditing(block)
                }}
                title="Double-clic pour renommer"
                className={[
                  'w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition duration-150',
                  active ? editorPanel.blockActive : editorPanel.block,
                ].join(' ')}
              >
                {displayLabel}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
