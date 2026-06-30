import type { AlignToken, BlockStyle, ColorValue, SpacingToken } from '@lp-studio/types'
import { backgroundPaletteTokens, textPaletteTokens } from '@lp-studio/tokens'
import { PalettePicker, PalettePreview } from './PalettePicker'

type StylePanelProps = {
  style: BlockStyle
  customColors: readonly string[]
  onAlign: (align: AlignToken) => void
  onColor: (key: 'bg' | 'text', value: ColorValue) => void
  onRemoveCustomColor: (hex: string) => void
  onMarginY: (marginY: SpacingToken) => void
}

export function StylePanel({ style, customColors, onAlign, onColor, onRemoveCustomColor, onMarginY }: StylePanelProps) {
  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <p className="mb-2 text-sm font-medium text-[#1A3066]">Alignement</p>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as AlignToken[]).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => onAlign(align)}
              className={`rounded border px-3 py-1 text-xs capitalize ${
                style.align === align ? 'border-[#E63946] bg-[#E3F2FD]' : ''
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      <PalettePreview bg={style.color.bg} text={style.color.text} />

      <PalettePicker
        label="Palette — Fond"
        value={style.color.bg}
        tokens={backgroundPaletteTokens}
        customColors={customColors}
        onChange={(value) => onColor('bg', value)}
        onRemoveCustom={onRemoveCustomColor}
      />

      <PalettePicker
        label="Palette — Texte"
        value={style.color.text}
        tokens={textPaletteTokens}
        customColors={customColors}
        onChange={(value) => onColor('text', value)}
        onRemoveCustom={onRemoveCustomColor}
      />

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[#1A3066]">Espacement vertical</span>
        <select
          className="w-full rounded border px-2 py-1"
          value={style.spacing.marginY}
          onChange={(e) => onMarginY(e.target.value as SpacingToken)}
        >
          <option value="tight">tight</option>
          <option value="normal">normal</option>
          <option value="loose">loose</option>
          <option value="xl">xl</option>
        </select>
      </label>
    </div>
  )
}
