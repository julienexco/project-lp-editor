import type { BlockInstance, PageMeta } from '@lp-studio/types'
import { hexColorsMatch, isPaletteToken, normalizeHex, registerPageCustomColor } from './color'

export function collectCustomColorsFromBlocks(blocks: BlockInstance[]): string[] {
  const hexes: string[] = []
  for (const block of blocks) {
    for (const key of ['bg', 'text'] as const) {
      const value = block.style.color[key]
      if (isPaletteToken(value)) continue
      hexes.push(normalizeHex(value))
    }
  }
  return hexes
}

function removedSet(meta: PageMeta): Set<string> {
  return new Set((meta.removedCustomColors ?? []).map(normalizeHex))
}

/** Fusionne meta.customColors + couleurs hex utilisées (sauf celles retirées par l'utilisateur) */
export function mergePageCustomColors(meta: PageMeta, blocks: BlockInstance[]): string[] {
  const removed = removedSet(meta)
  let colors = (meta.customColors ?? []).map(normalizeHex).filter((c) => !removed.has(c))
  for (const hex of collectCustomColorsFromBlocks(blocks)) {
    if (removed.has(hex)) continue
    colors = registerPageCustomColor(colors, hex)
  }
  return colors
}

export function getPageCustomColors(meta: PageMeta): string[] {
  const removed = removedSet(meta)
  return (meta.customColors ?? []).map(normalizeHex).filter((c) => !removed.has(c))
}

export function removePageCustomColor(meta: PageMeta, hex: string): PageMeta {
  const normalized = normalizeHex(hex)
  const customColors = (meta.customColors ?? []).filter((c) => !hexColorsMatch(c, normalized))
  const removedCustomColors = registerPageCustomColor(meta.removedCustomColors ?? [], normalized)
  return { ...meta, customColors, removedCustomColors }
}
