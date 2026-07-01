import type { BlockInstance, BlockStyle, BlockType, HeroContent, TypographyTheme } from '@lp-studio/types'
import { blockRegistry } from './block-registry'
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

type LegacyHeroContent = HeroContent & { showLogo?: boolean }

function migrateNavbarFromHero(blocks: BlockInstance[]): BlockInstance[] {
  if (blocks.some((b) => b.type === 'navbar')) return blocks

  const hero = blocks.find((b) => b.type === 'hero')
  if (!hero) return blocks

  const heroContent = hero.content as LegacyHeroContent
  if (!heroContent.showLogo) return blocks

  const navbarDefaults = blockRegistry.navbar.defaultStyle
  const minOrder = Math.min(...blocks.map((b) => b.order))

  const navbar: BlockInstance = {
    id: `b-navbar-${hero.id}`,
    type: 'navbar',
    order: minOrder - 1,
    content: {
      brandAlt: heroContent.eyebrow ?? '',
      ctaLabel: heroContent.ctaLabel ?? '',
      ctaHref: heroContent.ctaHref ?? '#',
      showLogo: true,
    },
    style: normalizeBlockStyle(navbarDefaults, 'navbar'),
  }

  const { showLogo: _removed, ...heroContentNext } = heroContent
  const updatedHero: BlockInstance = {
    ...hero,
    content: heroContentNext as HeroContent,
  }

  return [...blocks.map((b) => (b.id === hero.id ? updatedHero : b)), navbar]
    .sort((a, b) => a.order - b.order)
    .map((block, index) => ({ ...block, order: index }))
}

export function normalizePageBlocks(blocks: BlockInstance[]): BlockInstance[] {
  const migrated = migrateNavbarFromHero(blocks)
  return migrated.map((block) => ({
    ...block,
    style: normalizeBlockStyle(block.style, block.type),
  }))
}
