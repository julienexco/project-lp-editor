import type { PreviewViewport } from '@/components/editor/PreviewToolbar'
import { PREVIEW_VIEWPORTS } from '@/components/editor/PreviewToolbar'

type ViewportSwitcherProps = {
  viewport: PreviewViewport
  onViewportChange: (viewport: PreviewViewport) => void
  className?: string
}

export function ViewportSwitcher({ viewport, onViewportChange, className }: ViewportSwitcherProps) {
  return (
    <div
      className={['inline-flex rounded-lg border border-[#1A3066]/10 bg-[#f8fafc] p-0.5', className].filter(Boolean).join(' ')}
      role="group"
      aria-label="Taille de l'aperçu"
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
