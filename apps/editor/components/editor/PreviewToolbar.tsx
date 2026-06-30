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
          Double-clic pour éditer · sauvegarde auto
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
        <div
          className="inline-flex rounded-lg border border-[#1A3066]/10 bg-[#f8fafc] p-0.5"
          role="group"
          aria-label="Taille de l'aperçu"
          hidden={hideViewportSwitcher}
        >
          {(Object.keys(PREVIEW_VIEWPORTS) as PreviewViewport[]).map((key) => {
            const option = PREVIEW_VIEWPORTS[key]
            const active = viewport === key
            return (
              <button
                key={key}
                type="button"
                title={option.label}
                aria-label={option.label}
                aria-pressed={active}
                onClick={() => onViewportChange(key)}
                className={[
                  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition',
                  active ? 'bg-white text-[#1A3066] shadow-sm' : 'text-[#5C6B8A] hover:text-[#1A3066]',
                ].join(' ')}
              >
                <ViewportIcon type={option.icon} />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}

function ViewportIcon({ type }: { type: 'desktop' | 'tablet' | 'mobile' }) {
  if (type === 'mobile') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
      </svg>
    )
  }
  if (type === 'tablet') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
