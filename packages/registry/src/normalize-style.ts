import type { BlockInstance, BlockStyle, BlockType, TypographyTheme } from '@lp-studio/types'
import {
  blockTypographyRoles,
  defaultTypographyByBlock,
  migrateTypographyRoleStyle,
} from './typography'

export function normalizeBlockStyle(style: BlockStyle, blockType: BlockType): BlockStyle {
  const roles = blockTypographyRoles[blockType]
  const defaults = defaultTypographyByBlock[blockType]
  const typography: TypographyTheme = {}

  for (const role of roles) {
    const fallback = defaults[role]!
    typography[role] = migrateTypographyRoleStyle(style.typography?.[role], fallback)

    if (role === 'h1' && !style.typography?.h1) {
      typography.h1 = {
        ...typography.h1!,
        sizePx: typography.h1!.sizePx,
        weight: style.font.weight,
        family: style.font.family,
      }
    }
    if (role === 'h2' && !style.typography?.h2 && blockType === 'cta') {
      typography.h2 = {
        ...typography.h2!,
        sizePx: typography.h2!.sizePx,
        weight: style.font.weight,
        family: style.font.family,
      }
    }
    if (role === 'body' && !style.typography?.body && blockType === 'footer') {
      typography.body = {
        ...typography.body!,
        sizePx: typography.body!.sizePx,
        weight: style.font.weight,
        family: style.font.family,
      }
    }
  }

  return {
    ...style,
    typography,
    font: style.font ?? { family: 'poppins', size: 'md', weight: 'normal' },
  }
}

export function normalizePageBlocks(blocks: BlockInstance[]): BlockInstance[] {
  return blocks.map((block) => ({
    ...block,
    style: normalizeBlockStyle(block.style, block.type),
  }))
}
