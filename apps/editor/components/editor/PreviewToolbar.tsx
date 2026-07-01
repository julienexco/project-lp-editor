export type PreviewViewport = 'desktop' | 'tablet' | 'mobile'

export const PREVIEW_VIEWPORTS: Record<
  PreviewViewport,
  { label: string; width: string; icon: 'desktop' | 'tablet' | 'mobile' }
> = {
  desktop: { label: 'Desktop', width: '100%', icon: 'desktop' },
  tablet: { label: 'Tablette', width: '768px', icon: 'tablet' },
  mobile: { label: 'Mobile', width: '390px', icon: 'mobile' },
}

const VIEWPORT_STORAGE_KEY = 'lp-studio-preview-viewport'

export function detectDeviceViewport(): PreviewViewport {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export function loadSavedPreviewOverride(): PreviewViewport | null {
  if (typeof window === 'undefined') return null
  if (window.innerWidth < 1024) return null
  const stored = localStorage.getItem(VIEWPORT_STORAGE_KEY)
  if (stored === 'tablet' || stored === 'mobile' || stored === 'desktop') return stored
  return null
}

export function loadPreviewViewport(): PreviewViewport {
  return loadSavedPreviewOverride() ?? detectDeviceViewport()
}

export function savePreviewViewport(viewport: PreviewViewport) {
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    localStorage.setItem(VIEWPORT_STORAGE_KEY, viewport)
  }
}

import { ViewportSwitcher } from '@/components/preview/ViewportSwitcher'

type PreviewToolbarProps = {
  viewport: PreviewViewport
  onViewportChange: (viewport: PreviewViewport) => void
  selectedBlockLabel?: string | null
  onOpenPanel?: () => void
  panelOpen: boolean
  hideViewportSwitcher?: boolean
}

export function PreviewToolbar({
  viewport,
  onViewportChange,
  selectedBlockLabel,
  onOpenPanel,
  panelOpen,
  hideViewportSwitcher,
}: PreviewToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A3066]/10 bg-white px-3 py-2 sm:gap-3 sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {!panelOpen && onOpenPanel ? (
          <button
            type="button"
            onClick={onOpenPanel}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#1A3066]/15 px-2 py-1 text-xs font-medium text-[#1A3066] transition hover:bg-[#E3F2FD] md:hidden"
          >
            <MenuIcon />
            Éditer
          </button>
        ) : null}
        <p className="hidden min-w-0 truncate text-xs text-[#5C6B8A] sm:block">
          Double-clic = style · triple-clic texte = modifier · sauvegarde auto
        </p>
        {selectedBlockLabel ? (
          <p className="truncate text-xs font-medium text-[#1A3066] sm:hidden">{selectedBlockLabel}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {selectedBlockLabel ? (
          <p className="hidden truncate text-xs font-medium text-[#1A3066] sm:block">Bloc : {selectedBlockLabel}</p>
        ) : null}
        {hideViewportSwitcher ? (
          <p className="text-xs font-medium text-[#1A3066]">Aperçu {PREVIEW_VIEWPORTS[viewport].label.toLowerCase()}</p>
        ) : (
          <ViewportSwitcher viewport={viewport} onViewportChange={onViewportChange} />
        )}
      </div>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
