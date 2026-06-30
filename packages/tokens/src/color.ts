import type { BlockStyle, ColorValue, PaletteToken } from '@lp-studio/types'
import { brandColors, paletteLabels, paletteTokens } from './brand'

const darkBackgroundPresets: PaletteToken[] = ['navy', 'navyMuted', 'accent']

export function isPaletteToken(value: ColorValue): value is PaletteToken {
  return (paletteTokens as readonly string[]).includes(value)
}

export function normalizeHex(hex: string): string {
  const raw = hex.trim().replace(/^#/, '')
  if (raw.length === 3) {
    return `#${raw
      .split('')
      .map((c) => c + c)
      .join('')
      .toUpperCase()}`
  }
  if (raw.length === 6 && /^[0-9a-fA-F]{6}$/.test(raw)) {
    return `#${raw.toUpperCase()}`
  }
  return '#1A3066'
}

export function resolveColorHex(value: ColorValue): string {
  if (isPaletteToken(value)) return brandColors[value]
  return normalizeHex(value)
}

export function relativeLuminance(hex: string): number {
  const normalized = normalizeHex(hex).slice(1)
  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function isDarkBackgroundValue(bg: ColorValue): boolean {
  if (isPaletteToken(bg)) return darkBackgroundPresets.includes(bg)
  return relativeLuminance(resolveColorHex(bg)) < 0.45
}

export function isWhiteishBackground(bg: ColorValue): boolean {
  return relativeLuminance(resolveColorHex(bg)) > 0.92
}

export function colorValueLabel(value: ColorValue): string {
  if (isPaletteToken(value)) return paletteLabels[value]
  return resolveColorHex(value)
}

export function sectionColorStyle(style: BlockStyle): { backgroundColor: string; color: string } {
  return {
    backgroundColor: resolveColorHex(style.color.bg),
    color: resolveColorHex(style.color.text),
  }
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const normalized = normalizeHex(hex).slice(1)
  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      default:
        h = ((r - g) / d + 4) / 6
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100
  const ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ln - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return normalizeHex(`#${toHex(r)}${toHex(g)}${toHex(b)}`)
}

export const MAX_PAGE_CUSTOM_COLORS = 12

export function registerPageCustomColor(colors: readonly string[], hex: string): string[] {
  const normalized = normalizeHex(hex)
  const rest = colors.map(normalizeHex).filter((c) => c !== normalized)
  return [normalized, ...rest].slice(0, MAX_PAGE_CUSTOM_COLORS)
}

export function hexColorsMatch(a: string, b: string): boolean {
  return normalizeHex(a) === normalizeHex(b)
}

export function isCustomHexColor(value: ColorValue): value is `#${string}` {
  return !isPaletteToken(value)
}
