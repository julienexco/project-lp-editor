'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BlockRenderer, applyContentField } from '@lp-studio/blocks'
import { blockRegistry, normalizePageBlocks, resolveTypographyRole } from '@lp-studio/registry'
import type { BlockInstance, BlockStyle, BlockType, ColorValue, PageRecord, TypographyRole, TypographyRoleStyle } from '@lp-studio/types'
import { isPaletteToken, mergePageCustomColors, registerPageCustomColor, removePageCustomColor } from '@lp-studio/tokens'
import { BlockList } from './BlockList'
import { ContentFields } from './ContentFields'
import { EditorSectionTitle } from './EditorSectionTitle'
import { PREVIEW_VIEWPORTS, PreviewToolbar, detectDeviceViewport, loadSavedPreviewOverride, savePreviewViewport, type PreviewViewport } from './PreviewToolbar'
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
  const [page, setPage] = useState(() => {
    const blocks = normalizePageBlocks(initialPage.blocks)
    const customColors = mergePageCustomColors(initialPage.meta ?? {}, blocks)
    return {
      ...initialPage,
      blocks,
      meta: { ...initialPage.meta, customColors },
    }
  })
  const [selectedId, setSelectedId] = useState<string | null>(initialPage.blocks[0]?.id ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initialPage.updated_at ?? null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop')
  const [viewportOverride, setViewportOverride] = useState(false)
  const [isNativeNarrow, setIsNativeNarrow] = useState(false)

  const blocksRef = useRef(page.blocks)
  const metaRef = useRef(page.meta)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveInFlightRef = useRef(false)
  const needsResaveRef = useRef(false)

  useEffect(() => {
    blocksRef.current = page.blocks
    metaRef.current = page.meta
  }, [page.blocks, page.meta])

  useEffect(() => {
    const stored = localStorage.getItem(PANEL_STORAGE_KEY)
    if (stored === 'false') setPanelOpen(false)
    else if (stored === null && window.matchMedia('(max-width: 767px)').matches) {
      setPanelOpen(false)
    }

    const syncViewport = () => {
      const narrow = window.innerWidth < 1024
      setIsNativeNarrow(narrow)
      if (narrow) {
        setPreviewViewport(detectDeviceViewport())
        setViewportOverride(false)
        return
      }
      if (!viewportOverride) {
        setPreviewViewport(loadSavedPreviewOverride() ?? 'desktop')
      }
    }

    syncViewport()
    window.addEventListener('resize', syncViewport)
    return () => window.removeEventListener('resize', syncViewport)
  }, [viewportOverride])

  const togglePanel = () => {
    setPanelOpen((open) => {
      const next = !open
      localStorage.setItem(PANEL_STORAGE_KEY, String(next))
      return next
    })
  }

  const handleViewportChange = (viewport: PreviewViewport) => {
    setPreviewViewport(viewport)
    setViewportOverride(true)
    savePreviewViewport(viewport)
  }

  const selectedBlock = useMemo(
    () => page.blocks.find((b) => b.id === selectedId) ?? null,
    [page.blocks, selectedId],
  )

  const effectivePreviewWidth = isNativeNarrow ? '100%' : PREVIEW_VIEWPORTS[previewViewport].width
  const selectedBlockLabel = selectedBlock
    ? blockRegistry[selectedBlock.type as BlockType]?.label
    : null

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
          body: JSON.stringify({ blocks: blocksToSave, meta: metaRef.current }),
        })

        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as { error?: string } | null
          throw new Error(payload?.error ?? 'Échec de la sauvegarde')
        }

        const updated = (await res.json()) as PageRecord
        setPage((prev) => {
          const blocks = prev.blocks
          const customColors = mergePageCustomColors(updated.meta ?? prev.meta, blocks)
          return {
            ...prev,
            meta: { ...(updated.meta ?? prev.meta), customColors },
            updated_at: updated.updated_at,
          }
        })
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

  const updateColor = (key: 'bg' | 'text', value: ColorValue) => {
    if (!selectedBlock) return
    setPage((prev) => {
      const customColors = !isPaletteToken(value)
        ? registerPageCustomColor(prev.meta.customColors ?? [], value)
        : (prev.meta.customColors ?? [])

      const nextBlocks = prev.blocks.map((b) =>
        b.id === selectedBlock.id
          ? { ...b, style: { ...b.style, color: { ...b.style.color, [key]: value } } }
          : b,
      )

      const next = {
        ...prev,
        meta: { ...prev.meta, customColors },
        blocks: nextBlocks,
      }
      blocksRef.current = nextBlocks
      metaRef.current = next.meta
      return next
    })
    scheduleSave()
  }

  const removeCustomColor = (hex: string) => {
    setPage((prev) => {
      const nextMeta = removePageCustomColor(prev.meta, hex)
      const customColors = mergePageCustomColors(nextMeta, prev.blocks)
      const meta = { ...nextMeta, customColors }
      metaRef.current = meta
      return { ...prev, meta }
    })
    scheduleSave()
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
        body: JSON.stringify({ blocks, meta: metaRef.current }),
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
    <div className="flex h-[100dvh] flex-col bg-[#1A3066]">
      <header className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-white/60">LP Studio MVP</p>
          <h1 className="truncate text-lg font-semibold text-white">{page.name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-3">
          {!saving && !error && lastSavedAt ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-300" aria-live="polite">
              <CheckIcon />
              <span className="hidden sm:inline">{saveStatus}</span>
              <span className="sm:hidden">OK</span>
            </span>
          ) : (
            <span className={error ? 'text-[#E63946]' : 'text-white/80'} aria-live="polite">
              {saving ? 'Sauvegarde…' : error ?? saveStatus}
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

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {panelOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-[#1A3066]/50 md:hidden"
            aria-label="Fermer le panneau d'édition"
            onClick={togglePanel}
          />
        ) : null}

        <aside
          className={[
            'z-30 flex flex-col overflow-hidden bg-white',
            'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:w-[min(100vw,320px)] max-md:shadow-2xl max-md:transition-transform max-md:duration-300',
            panelOpen ? 'max-md:translate-x-0' : 'max-md:pointer-events-none max-md:-translate-x-full',
            'md:shrink-0 md:border-r md:border-white/10 md:transition-[width] md:duration-300 md:ease-in-out',
            panelOpen ? 'md:w-[min(100vw,320px)]' : 'md:w-0 md:border-r-0',
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

            <section className="border-b border-gray-200">
              <EditorSectionTitle>Blocs</EditorSectionTitle>
              <BlockList
                blocks={page.blocks}
                selectedId={selectedId}
                onSelect={setSelectedId}
                registry={blockRegistry}
              />
            </section>

            {selectedBlock ? (
              <>
                <section className="border-b border-gray-200">
                  <EditorSectionTitle>Contenu</EditorSectionTitle>
                  <div className="px-4 py-4">
                    <ContentFields
                      block={selectedBlock}
                      schema={blockRegistry[selectedBlock.type as BlockType].contentSchema}
                      onChange={updateContent}
                    />
                  </div>
                </section>

                <section className="border-b border-gray-200">
                  <EditorSectionTitle>Style</EditorSectionTitle>
                  <StylePanel
                    style={selectedBlock.style}
                    customColors={page.meta.customColors ?? []}
                    onAlign={(align) => updateStyle({ align })}
                    onColor={updateColor}
                    onRemoveCustomColor={removeCustomColor}
                    onMarginY={(marginY) => updateStyle({ spacing: { ...selectedBlock.style.spacing, marginY } })}
                  />
                </section>

                <section>
                  <EditorSectionTitle>Typographie</EditorSectionTitle>
                  <TypographyPanel
                    blockType={selectedBlock.type as BlockType}
                    style={selectedBlock.style}
                    onRoleChange={updateTypography}
                  />
                </section>
              </>
            ) : (
              <p className="p-4 text-sm text-gray-500">Sélectionnez un bloc pour éditer son contenu, son style et sa typographie.</p>
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

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#eef2f6]">
          <PreviewToolbar
            viewport={previewViewport}
            onViewportChange={handleViewportChange}
            selectedBlockLabel={selectedBlockLabel}
            onOpenPanel={togglePanel}
            panelOpen={panelOpen}
            hideViewportSwitcher={isNativeNarrow}
          />
          <div className={['flex-1 overflow-auto bg-[#dde3ea]', isNativeNarrow ? 'p-0' : 'p-3 sm:p-6'].join(' ')}>
            <div
              className={[
                'mx-auto min-h-full w-full bg-white transition-[width,max-width] duration-300 ease-out',
                isNativeNarrow ? '' : 'overflow-hidden shadow-xl ring-1 ring-[#1A3066]/10',
              ].join(' ')}
              style={{
                width: effectivePreviewWidth,
                maxWidth: effectivePreviewWidth === '100%' ? '100%' : effectivePreviewWidth,
              }}
            >
              <BlockRenderer
                blocks={page.blocks}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onContentEdit={updateBlockContent}
              />
            </div>
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
