'use client'

import { useEffect, useState } from 'react'
import type { AlignToken, BlockInstance, ColorValue, TypographyRole, TypographyRoleStyle } from '@lp-studio/types'
import { blockRegistry, blockTypographyRoles, getBlockLabel, typographyRoleLabels } from '@lp-studio/registry'
import { backgroundPaletteTokens, textPaletteTokens } from '@lp-studio/tokens'
import { PalettePicker } from './PalettePicker'
import { TypographyRoleControls } from './TypographyRoleControls'

type BlockContextEditorProps = {
  block: BlockInstance
  customColors: readonly string[]
  initialRole?: TypographyRole | null
  onClose: () => void
  onTypographyChange: (role: TypographyRole, partial: Partial<TypographyRoleStyle>) => void
  onAlign: (align: AlignToken) => void
  onColor: (key: 'bg' | 'text', value: ColorValue) => void
  onRemoveCustomColor: (hex: string) => void
}

export function BlockContextEditor({
  block,
  customColors,
  initialRole,
  onClose,
  onTypographyChange,
  onAlign,
  onColor,
  onRemoveCustomColor,
}: BlockContextEditorProps) {
  const roles = blockTypographyRoles[block.type]
  const [activeRole, setActiveRole] = useState<TypographyRole>(initialRole && roles.includes(initialRole) ? initialRole : roles[0]!)

  useEffect(() => {
    if (initialRole && roles.includes(initialRole)) {
      setActiveRole(initialRole)
    }
  }, [initialRole, block.id, roles])

  useEffect(() => {
    if (!roles.includes(activeRole)) setActiveRole(roles[0]!)
  }, [activeRole, roles])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const label = getBlockLabel(block, blockRegistry)

  return (
    <div className="absolute inset-0 z-40 flex justify-end p-3 sm:p-4" onClick={onClose} role="presentation">
      <aside
        className="pointer-events-auto flex max-h-full w-[min(100%,340px)] flex-col overflow-hidden rounded-xl border border-[#1A3066]/10 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Style et typographie — ${label}`}
      >
        <div className="flex items-start justify-between gap-2 border-b border-gray-100 px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#E63946]">Édition rapide</p>
            <h2 className="text-sm font-semibold text-[#1A3066]">{label}</h2>
            <p className="text-[11px] text-[#5C6B8A]">Typo par rôle · couleurs section</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#5C6B8A] hover:bg-gray-100"
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="mb-2 text-xs font-medium text-[#1A3066]">Élément de texte</p>
          <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={[
                  'shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition',
                  activeRole === role
                    ? 'border-[#E63946] bg-[#E3F2FD] text-[#1A3066]'
                    : 'border-gray-200 text-[#5C6B8A] hover:border-[#1A3066]/20',
                ].join(' ')}
              >
                {typographyRoleLabels[role]}
              </button>
            ))}
          </div>

          <TypographyRoleControls
            blockType={block.type}
            role={activeRole}
            style={block.style}
            customColors={customColors}
            onChange={(partial) => onTypographyChange(activeRole, partial)}
            compact
          />

          <div className="my-4 border-t border-gray-100" />

          <p className="mb-2 text-xs font-medium text-[#1A3066]">Section</p>
          <div className="mb-3">
            <p className="mb-1.5 text-xs text-[#5C6B8A]">Alignement</p>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as AlignToken[]).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onAlign(align)}
                  className={`rounded border px-2.5 py-1 text-xs capitalize ${
                    block.style.align === align ? 'border-[#E63946] bg-[#E3F2FD]' : ''
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <PalettePicker
              label="Fond"
              value={block.style.color.bg}
              tokens={backgroundPaletteTokens}
              customColors={customColors}
              onChange={(value) => onColor('bg', value)}
              onRemoveCustom={onRemoveCustomColor}
            />
            <PalettePicker
              label="Texte (section)"
              value={block.style.color.text}
              tokens={textPaletteTokens}
              customColors={customColors}
              onChange={(value) => onColor('text', value)}
              onRemoveCustom={onRemoveCustomColor}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
