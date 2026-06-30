'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BlockRenderer } from '@lp-studio/blocks'
import { blockRegistry } from '@lp-studio/registry'
import type { BlockInstance, BlockStyle, BlockType, PageRecord, PaletteToken } from '@lp-studio/types'
import { paletteTokens } from '@lp-studio/tokens'
import { BlockList } from './BlockList'
import { ContentFields } from './ContentFields'
import { StylePanel } from './StylePanel'

type EditorShellProps = {
  pageId: string
  initialPage: PageRecord
}

export function EditorShell({ pageId, initialPage }: EditorShellProps) {
  const [page, setPage] = useState(initialPage)
  const [selectedId, setSelectedId] = useState<string | null>(initialPage.blocks[0]?.id ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedBlock = useMemo(
    () => page.blocks.find((b) => b.id === selectedId) ?? null,
    [page.blocks, selectedId],
  )

  const persist = useCallback(
    (blocks: BlockInstance[]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        setSaving(true)
        setError(null)
        try {
          const res = await fetch(`/api/pages/${pageId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blocks }),
          })
          if (!res.ok) throw new Error('Échec de la sauvegarde')
          const updated = (await res.json()) as PageRecord
          setPage(updated)
        } catch {
          setError('Impossible de sauvegarder')
        } finally {
          setSaving(false)
        }
      }, 500)
    },
    [pageId],
  )

  const updateBlocks = useCallback(
    (updater: (blocks: BlockInstance[]) => BlockInstance[]) => {
      setPage((prev) => {
        const nextBlocks = updater(prev.blocks)
        persist(nextBlocks)
        return { ...prev, blocks: nextBlocks }
      })
    },
    [persist],
  )

  const updateContent = (field: string, value: unknown) => {
    if (!selectedBlock) return
    updateBlocks((blocks) =>
      blocks.map((b) =>
        b.id === selectedBlock.id ? { ...b, content: { ...b.content, [field]: value } } : b,
      ),
    )
  }

  const updateStyle = (partial: Partial<BlockStyle>) => {
    if (!selectedBlock) return
    updateBlocks((blocks) =>
      blocks.map((b) =>
        b.id === selectedBlock.id ? { ...b, style: { ...b.style, ...partial } } : b,
      ),
    )
  }

  const updateColor = (key: 'bg' | 'text', token: PaletteToken) => {
    if (!selectedBlock) return
    updateStyle({ color: { ...selectedBlock.style.color, [key]: token } })
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div className="flex h-screen flex-col bg-[#1A3066]">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">LP Studio MVP</p>
          <h1 className="text-lg font-semibold">{page.name}</h1>
        </div>
        <div className="text-sm text-white/80">
          {saving ? 'Sauvegarde…' : error ? <span className="text-[#E63946]">{error}</span> : 'Draft · local'}
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[320px_1fr] overflow-hidden">
        <aside className="flex flex-col overflow-y-auto border-r border-white/10 bg-white">
          <BlockList
            blocks={page.blocks}
            selectedId={selectedId}
            onSelect={setSelectedId}
            registry={blockRegistry}
          />
          {selectedBlock ? (
            <div className="border-t border-gray-200 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5C6B8A]">Contenu</p>
              <ContentFields
                block={selectedBlock}
                schema={blockRegistry[selectedBlock.type as BlockType].contentSchema}
                onChange={updateContent}
              />
              <StylePanel
                style={selectedBlock.style}
                palette={paletteTokens}
                onAlign={(align) => updateStyle({ align })}
                onColor={updateColor}
                onFontSize={(size) => updateStyle({ font: { ...selectedBlock.style.font, size } })}
                onMarginY={(marginY) => updateStyle({ spacing: { ...selectedBlock.style.spacing, marginY } })}
              />
            </div>
          ) : (
            <p className="p-4 text-sm text-gray-500">Sélectionnez un bloc</p>
          )}
        </aside>

        <main className="flex flex-col overflow-hidden bg-[#eef2f6]">
          <div className="border-b border-[#1A3066]/10 bg-white px-4 py-2 text-xs text-[#5C6B8A]">
            Aperçu responsive — redimensionnez la fenêtre pour tester mobile / tablette
          </div>
          <div className="flex-1 overflow-y-auto">
            <BlockRenderer blocks={page.blocks} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </main>
      </div>
    </div>
  )
}
