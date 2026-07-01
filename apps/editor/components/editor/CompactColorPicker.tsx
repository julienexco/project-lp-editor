'use client'

import type { ColorValue, PaletteToken } from '@lp-studio/types'
import { brandColors, isPaletteToken, normalizeHex, textPaletteTokens } from '@lp-studio/tokens'
import { editorPanel, type EditorPanelVariant } from './editor-panel-theme'

type CompactColorPickerProps = {
  label: string
  value?: ColorValue
  inheritLabel: string
  customColors: readonly string[]
  onChange: (value: ColorValue | undefined) => void
  variant?: EditorPanelVariant
}

export function CompactColorPicker({
  label,
  value,
  inheritLabel,
  customColors,
  onChange,
  variant = 'light',
}: CompactColorPickerProps) {
  const inherits = value === undefined
  const mutedClass = variant === 'dark' ? editorPanel.labelMuted : 'text-[#5C6B8A]'

  const swatch = (color: ColorValue, key: string) => {
    const hex = isPaletteToken(color) ? brandColors[color] : normalizeHex(color)
    const active = value !== undefined && (isPaletteToken(value) ? value === color : normalizeHex(value) === hex)
    return (
      <button
        key={key}
        type="button"
        title={hex}
        aria-pressed={active}
        onClick={() => onChange(color)}
        className={[
          'h-7 w-7 shrink-0 rounded-full border-2 transition',
          active ? 'border-[#E63946]' : 'border-transparent',
        ].join(' ')}
        style={{ backgroundColor: hex }}
      />
    )
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className={`text-xs ${mutedClass}`}>{label}</span>
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={[
            'rounded px-2 py-0.5 text-[10px] font-medium transition',
            inherits
              ? variant === 'dark'
                ? 'bg-[#E63946]/20 text-white'
                : 'bg-[#E3F2FD] text-[#1A3066]'
              : variant === 'dark'
                ? 'text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                : 'text-[#5C6B8A] hover:bg-gray-100',
          ].join(' ')}
        >
          {inheritLabel}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(textPaletteTokens as readonly PaletteToken[]).map((token) => swatch(token, token))}
        {customColors.map((hex) => swatch(hex as ColorValue, hex))}
      </div>
    </div>
  )
}
