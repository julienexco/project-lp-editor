'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BlockRenderer, applyContentField } from '@lp-studio/blocks'
import { blockRegistry } from '@lp-studio/registry'
import type { BlockInstance, BlockStyle, BlockType, PageRecord, PaletteToken } from '@lp-studio/types'
import { paletteTokens } from '@lp-studio/tokens'
import { BlockList } from './BlockList'
import { ContentFields } from './ContentFields'
import { StylePanel } from './StylePanel'

const PANEL_STORAGE_KEY = 'lp-studio-panel-open'

type EditorShellProps = {
  pageId: string
  initialPage: PageRecord
}

export function EditorShell({ pageId, initialPage }: EditorShellProps) {
  const [page, setPage] = useState(initialPage)
  const [selectedId, setSelectedId] = useState<string | null>(initialPage.blocks[0]?.id ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(PANEL_STORAGE_KEY)
    if (stored === 'false') setPanelOpen(false)
  }, [])

  const togglePanel = () => {
    setPanelOpen((open) => {
      const next = !open
      localStorage.setItem(PANEL_STORAGE_KEY, String(next))
      return next
    })
  }

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

  const updateBlockContent = useCallback(
    (blockId: string, field: string, value: string) => {
      setSelectedId(blockId)
      updateBlocks((blocks) =>
        blocks.map((b) =>
          b.id === blockId
            ? {
                ...b,
                content: applyContentField(b.content as Record<string, unknown>, field, value) as typeof b.content,
              }
            : b,
        ),
      )
    },
    [updateBlocks],
  )

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

      <div className="relative flex flex-1 overflow-hidden">
        <aside
          className={[
            'flex shrink-0 flex-col overflow-hidden border-r border-white/10 bg-white transition-[width] duration-300 ease-in-out',
            panelOpen ? 'w-[min(100vw,320px)]' : 'w-0 border-r-0',
          ].join(' ')}
          aria-hidden={!panelOpen}
        >
          <div className="flex h-full w-[min(100vw,320px)] flex-col overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5C6B8A]">Édition</p>
              <button
                type="button"
                onClick={togglePanel}
                className="rounded-md p-1.5 text-[#5C6B8A] transition hover:bg-[#E3F2FD] hover:text-[#1A3066]"
                title="Rétracter le panneau"
                aria-label="Rétracter le panneau"
              >
                <ChevronLeftIcon />
              </button>
            </div>

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
          </div>
        </aside>

        {!panelOpen ? (
          <button
            type="button"
            onClick={togglePanel}
            className="absolute left-0 top-1/2 z-20 flex -translate-y-1/2 items-center gap-1 rounded-r-lg border border-l-0 border-[#1A3066]/15 bg-white px-2 py-3 text-xs font-medium text-[#1A3066] shadow-md transition hover:bg-[#E3F2FD]"
            title="Afficher le panneau d'édition"
            aria-label="Afficher le panneau d'édition"
          >
            <ChevronRightIcon />
            <span className="hidden sm:inline">Édition</span>
          </button>
        ) : null}

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#eef2f6]">
          <div className="flex items-center justify-between gap-3 border-b border-[#1A3066]/10 bg-white px-4 py-2">
            <p className="text-xs text-[#5C6B8A]">
              Aperçu responsive — double-cliquez un texte pour l&apos;éditer · redimensionnez pour mobile / tablette
            </p>
            {!panelOpen && selectedBlock ? (
              <p className="truncate text-xs font-medium text-[#1A3066]">
                Bloc : {blockRegistry[selectedBlock.type as BlockType]?.label}
              </p>
            ) : null}
          </div>
          <div className="flex-1 overflow-y-auto">
            <BlockRenderer
              blocks={page.blocks}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onContentEdit={updateBlockContent}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
