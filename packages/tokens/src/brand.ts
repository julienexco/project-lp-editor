import type { PaletteToken } from '@lp-studio/types'

export const brandColors = {
  navy: '#1A3066',
  surface: '#E3F2FD',
  white: '#FFFFFF',
  accent: '#E63946',
  navyMuted: '#5C6B8A',
} as const

export const paletteTokens = ['navy', 'surface', 'white', 'accent', 'navyMuted'] as const

export const paletteLabels: Record<PaletteToken, string> = {
  navy: 'Bleu marine',
  surface: 'Bleu clair',
  white: 'Blanc',
  accent: 'Rouge accent',
  navyMuted: 'Gris bleu',
}

export const backgroundPaletteTokens = ['surface', 'white', 'navy', 'navyMuted', 'accent'] as const satisfies readonly PaletteToken[]

export const textPaletteTokens = ['navy', 'white', 'accent', 'navyMuted', 'surface'] as const satisfies readonly PaletteToken[]

const darkBackgroundPresets: PaletteToken[] = ['navy', 'navyMuted', 'accent']

export const darkBackgroundPaletteTokens = darkBackgroundPresets
