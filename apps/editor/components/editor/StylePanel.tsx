import type { AlignToken, BlockStyle, PaletteToken, SpacingToken } from '@lp-studio/types'

type StylePanelProps = {
  style: BlockStyle
  palette: readonly PaletteToken[]
  onAlign: (align: AlignToken) => void
  onColor: (key: 'bg' | 'text', token: PaletteToken) => void
  onMarginY: (marginY: SpacingToken) => void
}

const colorSwatch: Record<PaletteToken, string> = {
  navy: '#1A3066',
  surface: '#E3F2FD',
  white: '#FFFFFF',
  accent: '#E63946',
  navyMuted: '#5C6B8A',
}

export function StylePanel({ style, palette, onAlign, onColor, onMarginY }: StylePanelProps) {
  return (
    <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5C6B8A]">Style</p>

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

      <div>
        <p className="mb-2 text-sm font-medium text-[#1A3066]">Fond</p>
        <div className="flex flex-wrap gap-2">
          {palette.map((token) => (
            <button
              key={`bg-${token}`}
              type="button"
              title={token}
              onClick={() => onColor('bg', token)}
              className={`h-8 w-8 rounded-full border-2 ${
                style.color.bg === token ? 'border-[#E63946]' : 'border-transparent'
              }`}
              style={{ backgroundColor: colorSwatch[token] }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[#1A3066]">Texte</p>
        <div className="flex flex-wrap gap-2">
          {palette.map((token) => (
            <button
              key={`text-${token}`}
              type="button"
              title={token}
              onClick={() => onColor('text', token)}
              className={`h-8 w-8 rounded-full border-2 ${
                style.color.text === token ? 'border-[#E63946]' : 'border-transparent'
              }`}
              style={{ backgroundColor: colorSwatch[token] }}
            />
          ))}
        </div>
      </div>

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
