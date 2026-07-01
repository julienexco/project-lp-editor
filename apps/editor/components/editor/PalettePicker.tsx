'use client'

import { useCallback, useRef, useState } from 'react'
import type { ColorValue, PaletteToken } from '@lp-studio/types'
import {
  brandColors,
  colorValueLabel,
  hexColorsMatch,
  isCustomHexColor,
  isPaletteToken,
  normalizeHex,
  relativeLuminance,
  resolveColorHex,
} from '@lp-studio/tokens'
import { ColorPickerPopover } from './ColorPickerPopover'
import { editorPanel, type EditorPanelVariant } from './editor-panel-theme'

type PalettePickerProps = {
  label: string
  value: ColorValue
  tokens: readonly PaletteToken[]
  customColors: readonly string[]
  onChange: (value: ColorValue) => void
  onRemoveCustom?: (hex: string) => void
  variant?: EditorPanelVariant
}

const SWATCH =
  'h-12 w-12 shrink-0 rounded-full border-[3px] transition duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E63946]'

function swatchActive(active: boolean): string {
  return active
    ? 'border-[#E63946] shadow-[0_0_0_3px_rgba(230,57,70,0.28)]'
    : 'border-transparent shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]'
}

function swatchNeedsBorder(token: PaletteToken): boolean {
  return token === 'white' || token === 'surface'
}

function plusIconClass(hex: string | null): string {
  if (!hex) return 'text-[#5C6B8A]'
  return relativeLuminance(hex) < 0.55 ? 'text-white' : 'text-[#1A3066]/70'
}

export function PalettePicker({
  label,
  value,
  tokens,
  customColors,
  onChange,
  onRemoveCustom,
  variant = 'light',
}: PalettePickerProps) {
  const customBtnRef = useRef<HTMLButtonElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const displayHex = resolveColorHex(value)
  const valueIsCustomHex = isCustomHexColor(value)
  const valueHex = valueIsCustomHex ? normalizeHex(value) : null
  const savedCustomActive =
    valueHex != null && customColors.some((c) => hexColorsMatch(c, valueHex))
  const plusShowsColor = valueIsCustomHex && !savedCustomActive
  const plusActive = pickerOpen || plusShowsColor

  const handleCustomChange = useCallback(
    (hex: string) => {
      onChange(normalizeHex(hex) as ColorValue)
    },
    [onChange],
  )

  return (
    <div className="relative">
      <p className={variant === 'dark' ? `mb-3 ${editorPanel.label}` : 'mb-3 text-sm font-medium text-[#1A3066]'}>{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        {tokens.map((token) => {
          const active = isPaletteToken(value) && value === token
          const hex = brandColors[token]
          return (
            <button
              key={token}
              type="button"
              onClick={() => {
                onChange(token)
                setPickerOpen(false)
              }}
              aria-pressed={active}
              title={`${colorValueLabel(token)} (${hex})`}
              className={[SWATCH, swatchActive(active), swatchNeedsBorder(token) ? 'ring-1 ring-[#1A3066]/10' : ''].join(
                ' ',
              )}
              style={{ backgroundColor: hex }}
            />
          )
        })}

        {customColors.map((hex) => {
          const active = valueHex != null && hexColorsMatch(hex, valueHex)
          return (
            <div key={hex} className="group relative">
              <button
                type="button"
                onClick={() => {
                  onChange(hex as ColorValue)
                  setPickerOpen(false)
                }}
                aria-pressed={active}
                title={`Personnalisée (${hex})`}
                className={[SWATCH, swatchActive(active)].join(' ')}
                style={{ backgroundColor: hex }}
              />
              {onRemoveCustom ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveCustom(hex)
                  }}
                  className={[
                    'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#1A3066] text-white shadow-md transition',
                    'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
                    active ? 'opacity-100' : '',
                    'hover:bg-[#E63946] focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#E63946]',
                  ].join(' ')}
                  title="Retirer de la palette"
                  aria-label={`Retirer ${hex} de la palette`}
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              ) : null}
            </div>
          )
        })}

        <button
          ref={customBtnRef}
          type="button"
          onClick={() => setPickerOpen(true)}
          aria-pressed={plusActive}
          title="Ajouter une couleur personnalisée"
          className={[
            SWATCH,
            'flex items-center justify-center',
            plusActive
              ? swatchActive(true)
              : variant === 'dark'
                ? 'border-dashed border-white/15 bg-[#242429] hover:border-white/25'
                : 'border-dashed border-[#1A3066]/30 bg-white hover:border-[#1A3066]/50',
          ].join(' ')}
          style={plusShowsColor ? { backgroundColor: displayHex, borderStyle: 'solid' } : undefined}
        >
          <span
            className={[
              'pointer-events-none text-2xl font-light leading-none',
              plusIconClass(plusShowsColor ? displayHex : null),
            ].join(' ')}
            aria-hidden
          >
            +
          </span>
        </button>
      </div>

      {pickerOpen ? (
        <ColorPickerPopover
          hex={displayHex}
          anchorRef={customBtnRef}
          onClose={() => setPickerOpen(false)}
          onChange={handleCustomChange}
        />
      ) : null}
    </div>
  )
}

type PalettePreviewProps = {
  bg: ColorValue
  text: ColorValue
  variant?: EditorPanelVariant
}

export function PalettePreview({ bg, text, variant = 'light' }: PalettePreviewProps) {
  return (
    <div
      className={[
        'rounded-lg border px-4 py-3 text-sm font-medium shadow-sm',
        variant === 'dark' ? 'border-zinc-600/50' : 'border-[#1A3066]/10',
      ].join(' ')}
      style={{
        backgroundColor: resolveColorHex(bg),
        color: resolveColorHex(text),
      }}
    >
      Aperçu — {colorValueLabel(bg)} / {colorValueLabel(text)}
    </div>
  )
}
