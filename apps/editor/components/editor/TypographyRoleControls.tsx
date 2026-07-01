'use client'

import type { BlockStyle, BlockType, ColorValue, FontFamilyToken, TypographyRole, TypographyRoleStyle, WeightToken } from '@lp-studio/types'
import { clampSizePx, resolveTypographyRole } from '@lp-studio/registry'
import { deriveResponsiveFontSizes, fontFamilyLabels, fontFamilyTokens, weightLabels } from '@lp-studio/tokens'
import { CompactColorPicker } from './CompactColorPicker'

const weightOptions: WeightToken[] = ['normal', 'medium', 'bold']

type TypographyRoleControlsProps = {
  blockType: BlockType
  role: TypographyRole
  style: BlockStyle
  customColors: readonly string[]
  onChange: (partial: Partial<TypographyRoleStyle>) => void
  compact?: boolean
}

export function TypographyRoleControls({
  blockType,
  role,
  style,
  customColors,
  onChange,
  compact,
}: TypographyRoleControlsProps) {
  const resolved = resolveTypographyRole(blockType, style, role)
  const sizes = deriveResponsiveFontSizes(resolved.sizePx)

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <label className="block text-xs">
        <span className="mb-1 block text-[#5C6B8A]">Police</span>
        <select
          className="w-full rounded border px-2 py-1.5 text-sm"
          value={resolved.family}
          onChange={(e) => onChange({ family: e.target.value as FontFamilyToken })}
        >
          {fontFamilyTokens.map((family) => (
            <option key={family} value={family}>
              {fontFamilyLabels[family]}
            </option>
          ))}
        </select>
      </label>

      <div className={compact ? 'grid grid-cols-[1fr_auto] items-end gap-2' : 'grid grid-cols-2 gap-2'}>
        <label className="block text-xs">
          <span className="mb-1 block text-[#5C6B8A]">Taille desktop (px)</span>
          <input
            type="number"
            min={10}
            max={120}
            step={1}
            className="w-full rounded border px-2 py-1.5 text-sm"
            value={resolved.sizePx}
            onChange={(e) => onChange({ sizePx: clampSizePx(Number(e.target.value) || resolved.sizePx) })}
          />
        </label>
        {compact ? (
          <div className="block text-xs">
            <span className="mb-1 block text-[#5C6B8A]">Graisse</span>
            <button
              type="button"
              aria-pressed={resolved.weight === 'bold'}
              title={resolved.weight === 'bold' ? 'Désactiver le gras' : 'Activer le gras'}
              onClick={() => onChange({ weight: resolved.weight === 'bold' ? 'normal' : 'bold' })}
              className={[
                'flex h-[34px] min-w-[4.5rem] items-center justify-center rounded border px-3 text-sm transition',
                resolved.weight === 'bold'
                  ? 'border-[#E63946] bg-[#E3F2FD] font-bold text-[#1A3066]'
                  : 'border-gray-200 font-semibold text-[#5C6B8A] hover:border-[#1A3066]/20',
              ].join(' ')}
            >
              Gras
            </button>
          </div>
        ) : (
          <label className="block text-xs">
            <span className="mb-1 block text-[#5C6B8A]">Graisse</span>
            <select
              className="w-full rounded border px-2 py-1.5 text-sm"
              value={resolved.weight}
              onChange={(e) => onChange({ weight: e.target.value as WeightToken })}
            >
              {weightOptions.map((weight) => (
                <option key={weight} value={weight}>
                  {weightLabels[weight]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {!compact ? (
        <p className="text-[11px] leading-relaxed text-[#5C6B8A]">
          Tablette {sizes.tablet}px · Mobile {sizes.mobile}px
        </p>
      ) : null}

      <CompactColorPicker
        label="Couleur du texte (rôle)"
        value={resolved.textColor}
        inheritLabel="Hériter de la section"
        customColors={customColors}
        onChange={(textColor: ColorValue | undefined) => onChange({ textColor })}
      />
    </div>
  )
}
