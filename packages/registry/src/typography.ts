import type { BlockType, FontFamilyToken, SizeToken, TypographyRole, TypographyRoleStyle, TypographyTheme, WeightToken } from '@lp-studio/types'

export const typographyRoleLabels: Record<TypographyRole, string> = {
  h1: 'Titre H1',
  h2: 'Titre H2',
  h3: 'Titre H3',
  eyebrow: 'Sur-titre',
  body: 'Paragraphe',
  caption: 'Légende',
  stat: 'Chiffre clé',
}

export const blockTypographyRoles: Record<BlockType, TypographyRole[]> = {
  hero: ['eyebrow', 'h1', 'body', 'stat', 'caption'],
  featureGrid: ['h2', 'h3', 'eyebrow', 'body'],
  cta: ['h2', 'body'],
  footer: ['body', 'caption'],
}

export const sizeTokenToPx: Record<SizeToken, number> = {
  sm: 14,
  md: 18,
  lg: 32,
  xl: 52,
}

const defaultFamily: FontFamilyToken = 'poppins'

function role(
  sizePx: number,
  weight: WeightToken,
  family: FontFamilyToken = defaultFamily,
): TypographyRoleStyle {
  return { sizePx, weight, family }
}

export const defaultTypographyByBlock: Record<BlockType, TypographyTheme> = {
  hero: {
    eyebrow: role(12, 'medium'),
    h1: role(52, 'bold'),
    body: role(18, 'normal'),
    stat: role(32, 'bold'),
    caption: role(13, 'normal'),
  },
  featureGrid: {
    h2: role(36, 'bold'),
    h3: role(22, 'bold'),
    eyebrow: role(12, 'medium'),
    body: role(17, 'normal'),
  },
  cta: {
    h2: role(36, 'bold'),
    body: role(18, 'normal'),
  },
  footer: {
    body: role(15, 'normal'),
    caption: role(13, 'medium'),
  },
}

type LegacyTypographyRoleStyle = Partial<TypographyRoleStyle> & {
  size?: SizeToken
}

export function clampSizePx(value: number): number {
  return Math.min(120, Math.max(10, Math.round(value)))
}

export function migrateTypographyRoleStyle(
  raw: LegacyTypographyRoleStyle | undefined,
  fallback: TypographyRoleStyle,
): TypographyRoleStyle {
  if (!raw) return fallback

  const sizePx =
    typeof raw.sizePx === 'number'
      ? clampSizePx(raw.sizePx)
      : raw.size
        ? sizeTokenToPx[raw.size]
        : fallback.sizePx

  return {
    sizePx,
    weight: raw.weight ?? fallback.weight,
    family: raw.family ?? fallback.family,
  }
}

export function resolveTypographyRole(
  blockType: BlockType,
  style: {
    font: { family: FontFamilyToken; size: SizeToken; weight: WeightToken }
    typography?: TypographyTheme
  },
  roleKey: TypographyRole,
): TypographyRoleStyle {
  const defaults = defaultTypographyByBlock[blockType][roleKey] ?? role(18, 'normal')
  const legacyFallback: TypographyRoleStyle = {
    ...defaults,
    family: style.font.family ?? defaults.family ?? defaultFamily,
  }

  if (roleKey === 'h1' && !style.typography?.h1) {
    legacyFallback.sizePx = sizeTokenToPx[style.font.size] ?? defaults.sizePx
    legacyFallback.weight = style.font.weight
  }
  if (roleKey === 'h2' && !style.typography?.h2 && blockType === 'cta') {
    legacyFallback.sizePx = sizeTokenToPx[style.font.size] ?? defaults.sizePx
    legacyFallback.weight = style.font.weight
  }
  if (roleKey === 'body' && !style.typography?.body && blockType === 'footer') {
    legacyFallback.sizePx = sizeTokenToPx[style.font.size] ?? defaults.sizePx
    legacyFallback.weight = style.font.weight
  }

  return migrateTypographyRoleStyle(style.typography?.[roleKey] as LegacyTypographyRoleStyle, legacyFallback)
}
