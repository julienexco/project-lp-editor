'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BlockRenderer, applyContentField } from '@lp-studio/blocks'
import { blockRegistry, normalizePageBlocks, resolveTypographyRole } from '@lp-studio/registry'
import type { BlockInstance, BlockStyle, BlockType, PageRecord, PaletteToken, TypographyRole, TypographyRoleStyle } from '@lp-studio/types'
import { paletteTokens } from '@lp-studio/tokens'
import { BlockList } from './BlockList'
import { ContentFields } from './ContentFields'
import { StylePanel } from './StylePanel'
import { TypographyPanel } from './TypographyPanel'

const PANEL_STORAGE_KEY = 'lp-studio-panel-open'
const SAVE_DEBOUNCE_MS = 500

type EditorShellProps = {
  pageId: string
  initialPage: PageRecord
}

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function EditorShell({ pageId, initialPage }: EditorShellProps) {
  const [page, setPage] = useState(() => ({
    ...initialPage,
    blocks: normalizePageBlocks(initialPage.blocks),
  }))
  const [selectedId, setSelectedId] = useState<string | null>(initialPage.blocks[0]?.id ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialPage.updated_at ?? null)
  const [panelOpen, setPanelOpen] = useState(true)

  const blocksRef = useRef(page.blocks)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveInFlightRef = useRef(false)
  const needsResaveRef = useRef(false)

  useEffect(() => {
    blocksRef.current = page.blocks
  }, [page.blocks])

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

  const runSave = useCallback(async () => {
    if (saveInFlightRef.current) {
      needsResaveRef.current = true
      return
    }

    saveInFlightRef.current = true
    setSaving(true)
    setError(null)

    try {
      do {
        needsResaveRef.current = false
        const blocksToSave = blocksRef.current

        const res = await fetch(`/api/pages/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blocks: blocksToSave }),
        })

        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as { error?: string } | null
          throw new Error(payload?.error ?? 'Échec de la sauvegarde')
        }

        const updated = (await res.json()) as PageRecord
        setLastSavedAt(updated.updated_at ?? new Date().toISOString())
      } while (needsResaveRef.current)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de sauvegarder')
    } finally {
      saveInFlightRef.current = false
      setSaving(false)
    }
  }, [pageId])

  const scheduleSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void runSave()
    }, SAVE_DEBOUNCE_MS)
  }, [runSave])

  const flushSave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    void runSave()
  }, [runSave])

  const updateBlocks = useCallback(
    (updater: (blocks: BlockInstance[]) => BlockInstance[]) => {
      setPage((prev) => {
        const nextBlocks = updater(prev.blocks)
        blocksRef.current = nextBlocks
        return { ...prev, blocks: nextBlocks }
      })
      scheduleSave()
    },
    [scheduleSave],
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

  const updateTypography = (role: TypographyRole, partial: Partial<TypographyRoleStyle>) => {
    if (!selectedBlock) return
    const current = resolveTypographyRole(selectedBlock.type as BlockType, selectedBlock.style, role)
    updateStyle({
      typography: {
        ...selectedBlock.style.typography,
        [role]: { ...current, ...partial },
      },
    })
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
    const onBeforeUnload = () => {
      if (!debounceRef.current) return
      clearTimeout(debounceRef.current)
      debounceRef.current = null
      const blocks = blocksRef.current
      fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks }),
        keepalive: true,
      }).catch(() => undefined)
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [pageId])

  const saveStatus = saving
    ? 'Sauvegarde…'
    : error
      ? error
      : lastSavedAt
        ? `Sauvegardé à ${formatSavedAt(lastSavedAt)}`
        : 'Brouillon · non sauvegardé'

  return (
    <div className="flex h-screen flex-col bg-[#1A3066]">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">LP Studio MVP</p>
          <h1 className="text-lg font-semibold">{page.name}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {!saving && !error && lastSavedAt ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-300" aria-live="polite">
              <CheckIcon />
              {saveStatus}
            </span>
          ) : (
            <span className={error ? 'text-[#E63946]' : 'text-white/80'} aria-live="polite">
              {saveStatus}
            </span>
          )}
          <button
            type="button"
            onClick={flushSave}
            disabled={saving}
            className="rounded-md border border-white/20 px-2.5 py-1 text-xs font-medium text-white/90 transition hover:bg-white/10 disabled:opacity-50"
          >
            Sauvegarder
          </button>
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
                  onMarginY={(marginY) => updateStyle({ spacing: { ...selectedBlock.style.spacing, marginY } })}
                />
                <TypographyPanel
                  blockType={selectedBlock.type as BlockType}
                  style={selectedBlock.style}
                  onRoleChange={updateTypography}
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
              Aperçu responsive — double-cliquez un texte pour l&apos;éditer · sauvegarde auto à chaque modification
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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
