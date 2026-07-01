import type {
  AlignToken,
  AnimationToken,
  BlockStyle,
  ColorValue,
  FontFamilyToken,
  PaletteToken,
  SizeToken,
  SpacingToken,
  TypographyRole,
  TypographyRoleStyle,
  WeightToken,
} from '@lp-studio/types'

export {
  brandColors,
  paletteTokens,
  paletteLabels,
  backgroundPaletteTokens,
  textPaletteTokens,
} from './brand'

export {
  colorValueLabel,
  hexColorsMatch,
  hexToHsl,
  hslToHex,
  isCustomHexColor,
  isDarkBackgroundValue,
  isPaletteToken,
  isWhiteishBackground,
  MAX_PAGE_CUSTOM_COLORS,
  normalizeHex,
  relativeLuminance,
  registerPageCustomColor,
  resolveColorHex,
  sectionColorStyle,
} from './color'

export { collectCustomColorsFromBlocks, getPageCustomColors, mergePageCustomColors, removePageCustomColor } from './page-palette'

import { brandColors } from './brand'
import { isDarkBackgroundValue, isPaletteToken, isWhiteishBackground, resolveColorHex } from './color'

export const fontFamilyTokens = [
  'poppins',
  'inter',
  'open-sans',
  'roboto',
  'montserrat',
  'playfair-display',
  'lora',
] as const satisfies readonly FontFamilyToken[]

export const fontFamilyLabels: Record<FontFamilyToken, string> = {
  poppins: 'Poppins',
  inter: 'Inter',
  'open-sans': 'Open Sans',
  roboto: 'Roboto',
  montserrat: 'Montserrat',
  'playfair-display': 'Playfair Display',
  lora: 'Lora',
}

const bgClass: Record<PaletteToken, string> = {
  navy: 'bg-[#1A3066]',
  surface: 'bg-[#E3F2FD]',
  white: 'bg-white',
  accent: 'bg-[#E63946]',
  navyMuted: 'bg-[#5C6B8A]',
}

const textClass: Record<PaletteToken, string> = {
  navy: 'text-[#1A3066]',
  surface: 'text-[#E3F2FD]',
  white: 'text-white',
  accent: 'text-[#E63946]',
  navyMuted: 'text-[#5C6B8A]',
}

const darkBackgrounds: PaletteToken[] = ['navy', 'navyMuted', 'accent']

export function paletteBgClass(token: PaletteToken): string {
  return bgClass[token]
}

export function paletteTextClass(token: PaletteToken): string {
  return textClass[token]
}

/** @deprecated use isDarkBackgroundValue */
export function isDarkBackground(bg: ColorValue): boolean {
  return isDarkBackgroundValue(bg)
}

/** Texte principal selon la couleur du bloc */
export function primaryTextClass(style: BlockStyle): string {
  if (isPaletteToken(style.color.text)) return textClass[style.color.text]
  return ''
}

/** Texte secondaire lisible sur le fond du bloc */
export function secondaryTextClass(style: BlockStyle): string {
  if (isDarkBackgroundValue(style.color.bg)) {
    if (isPaletteToken(style.color.text) && style.color.text === 'surface') return textClass.surface
    return 'opacity-80'
  }
  if (!isPaletteToken(style.color.text)) return 'opacity-70'
  return textClass.navyMuted
}

/** Texte sur cartes blanches (toujours fond clair) */
export function cardPrimaryTextClass(): string {
  return textClass.navy
}

export function cardSecondaryTextClass(): string {
  return textClass.navyMuted
}

const marginYClass: Record<SpacingToken, string> = {
  tight: 'py-12 @sm:py-14',
  normal: 'py-16 @sm:py-20',
  loose: 'py-20 @sm:py-24 @lg:py-28',
  xl: 'py-24 @sm:py-28 @lg:py-32',
}

const paddingXClass: Record<SpacingToken, string> = {
  tight: 'px-4 @sm:px-6',
  normal: 'px-4 @sm:px-6 @lg:px-8',
  loose: 'px-4 @sm:px-8 @lg:px-12',
  xl: 'px-4 @sm:px-10 @lg:px-16',
}

const sizeClass: Record<SizeToken, string> = {
  sm: 'text-sm sm:text-base',
  md: 'text-base sm:text-lg',
  lg: 'text-2xl sm:text-3xl lg:text-4xl',
  xl: 'text-[2rem] leading-[1.08] sm:text-[2.75rem] lg:text-[3.5rem]',
}

const weightClass: Record<WeightToken, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold',
}

const fontClass: Record<FontFamilyToken, string> = {
  poppins: 'font-[family-name:var(--font-poppins)]',
  inter: 'font-[family-name:var(--font-inter)]',
  'open-sans': 'font-[family-name:var(--font-open-sans)]',
  roboto: 'font-[family-name:var(--font-roboto)]',
  montserrat: 'font-[family-name:var(--font-montserrat)]',
  'playfair-display': 'font-[family-name:var(--font-playfair-display)]',
  lora: 'font-[family-name:var(--font-lora)]',
}

const animationClass: Record<AnimationToken, string> = {
  none: '',
  'fade-in': 'animate-in fade-in duration-700',
  'slide-up': 'animate-in fade-in slide-in-from-bottom-4 duration-700',
}

export function sectionTheme(style: BlockStyle): string {
  return [animationClass[style.animation], fontClass[style.font.family]].filter(Boolean).join(' ')
}

export function sectionSpacing(style: BlockStyle): string {
  return [marginYClass[style.spacing.marginY], paddingXClass[style.spacing.paddingX]].join(' ')
}

/** @deprecated use sectionTheme + sectionSpacing */
export function applyBlockStyle(style: BlockStyle): string {
  return [sectionTheme(style), sectionSpacing(style)].join(' ')
}

export const weightLabels: Record<WeightToken, string> = {
  normal: 'Normal (400)',
  medium: 'Medium (500)',
  bold: 'Gras (700)',
}

/** Desktop size drives tablet (78%) and mobile (58%) automatically. */
export const RESPONSIVE_FONT_SCALE = {
  mobile: 0.58,
  tablet: 0.78,
  desktop: 1,
} as const

const FLUID_MOBILE_WIDTH_PX = 390
const FLUID_DESKTOP_WIDTH_PX = 1024
const FLUID_WIDTH_SPAN_PX = FLUID_DESKTOP_WIDTH_PX - FLUID_MOBILE_WIDTH_PX

export function deriveResponsiveFontSizes(desktopPx: number): {
  desktop: number
  tablet: number
  mobile: number
} {
  const desktop = Math.min(120, Math.max(10, Math.round(desktopPx)))
  return {
    desktop,
    tablet: Math.max(10, Math.round(desktop * RESPONSIVE_FONT_SCALE.tablet)),
    mobile: Math.max(10, Math.round(desktop * RESPONSIVE_FONT_SCALE.mobile)),
  }
}

/** Fluid font-size from a single desktop px value, scaled by preview container width. */
export function fluidFontSizeFromDesktop(desktopPx: number): string {
  const { desktop, mobile } = deriveResponsiveFontSizes(desktopPx)
  return `clamp(${mobile}px, calc(${mobile}px + (${desktop} - ${mobile}) * ((100cqw - ${FLUID_MOBILE_WIDTH_PX}px) / ${FLUID_WIDTH_SPAN_PX})), ${desktop}px)`
}

const lineHeightByRole: Record<TypographyRole, number> = {
  h1: 1.08,
  h2: 1.15,
  h3: 1.2,
  eyebrow: 1.4,
  body: 1.6,
  caption: 1.45,
  stat: 1.1,
}

const roleExtras: Record<TypographyRole, string> = {
  h1: 'tracking-tight text-balance',
  h2: 'tracking-tight text-balance',
  h3: 'tracking-tight',
  eyebrow: 'uppercase tracking-[0.24em]',
  body: '',
  caption: '',
  stat: 'tracking-tight',
}

export function typographyPresentation(
  roleStyle: TypographyRoleStyle,
  role: TypographyRole,
): { className: string; style: { fontSize: string; lineHeight: number } } {
  return {
    className: [fontClass[roleStyle.family], weightClass[roleStyle.weight], roleExtras[role]].filter(Boolean).join(' '),
    style: {
      fontSize: fluidFontSizeFromDesktop(roleStyle.sizePx),
      lineHeight: lineHeightByRole[role],
    },
  }
}

/** @deprecated use typographyPresentation */
export function typographyClass(roleStyle: TypographyRoleStyle, role: TypographyRole): string {
  const { className } = typographyPresentation(roleStyle, role)
  return className
}

/** @deprecated */
export function headingClass(style: BlockStyle): string {
  return typographyClass({ sizePx: 52, weight: style.font.weight, family: style.font.family }, 'h1')
}

/** @deprecated */
export function sectionTitleClass(style: BlockStyle): string {
  return typographyClass({ sizePx: 36, weight: 'bold', family: style.font.family }, 'h2')
}

export function sectionLabelClass(): string {
  return 'text-xs font-semibold uppercase tracking-[0.2em] text-[#E63946]'
}

/** @deprecated */
export function bodyClass(style: BlockStyle): string {
  return typographyClass({ sizePx: 18, weight: 'normal', family: style.font.family }, 'body')
}

export function mutedClass(): string {
  return textClass.navyMuted
}

export function accentButtonClass(variant: 'default' | 'onDark' = 'default'): string {
  const base = [
    'group inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-lg px-7 py-3.5 @sm:w-auto @sm:min-h-12 @sm:px-8 @sm:py-3.5',
    'text-sm @sm:text-base font-semibold tracking-tight transition duration-200',
    'hover:translate-y-[-1px] active:translate-y-0',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'cursor-pointer',
  ]

  if (variant === 'onDark') {
    return [
      ...base,
      'bg-[#E63946] text-white shadow-sm shadow-[#E63946]/20 hover:brightness-110 focus-visible:outline-white',
    ].join(' ')
  }

  return [
    ...base,
    'bg-[#1A3066] text-white shadow-sm shadow-[#1A3066]/15 hover:bg-[#152a55] focus-visible:outline-[#1A3066]',
  ].join(' ')
}

export function navCtaButtonClass(): string {
  return [
    'inline-flex min-h-10 items-center justify-center rounded-lg border border-[#1A3066]/20 px-5 py-2',
    'text-xs font-semibold text-[#1A3066] transition duration-200 @sm:min-h-11 @sm:px-6 @sm:py-2.5 @sm:text-sm',
    'bg-transparent hover:border-[#1A3066]/35 hover:bg-[#1A3066]/[0.04]',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3066]',
    'cursor-pointer',
  ].join(' ')
}

export function ghostButtonClass(): string {
  return [
    'inline-flex min-h-10 items-center justify-center rounded-full border border-[#1A3066]/15 px-4 py-2',
    'text-xs font-semibold text-[#1A3066] transition duration-200 @sm:min-h-11 @sm:px-5 @sm:py-2.5 @sm:text-sm',
    'hover:border-[#1A3066]/30 hover:bg-[#E3F2FD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3066]',
    'cursor-pointer',
  ].join(' ')
}

export function navBarVisualClass(): string {
  return 'border-b border-[#1A3066]/6 bg-white/98 backdrop-blur-sm'
}

/** Header fixe en haut de la page (aperçu publié) */
export function navBarFixedClass(): string {
  return ['fixed inset-x-0 top-0 z-50 w-full', navBarVisualClass()].join(' ')
}

/** Header fixe au scroll dans le conteneur parent (éditeur) */
export function navBarStickyClass(): string {
  return ['sticky top-0 z-50 w-full', navBarVisualClass()].join(' ')
}

/** Réserve l'espace sous un header en position fixed */
export function navBarSpacerClass(): string {
  return 'pointer-events-none h-14 w-full shrink-0 @sm:h-[3.625rem]'
}

/** @deprecated use navBarStickyClass or navBarFixedClass */
export function navBarClass(): string {
  return navBarStickyClass()
}

export const RESPONSIVE_BREAKPOINTS = {
  /** 480px — typo / spacing, pas les grilles multi-colonnes */
  sm: '30rem',
  /** 768px — 2 colonnes */
  md: '48rem',
  /** 1024px — 3+ colonnes */
  lg: '64rem',
} as const

/** Largeur preview mobile éditeur — en dessous : layout empilé */
export const MOBILE_PREVIEW_WIDTH_PX = 390

export function containerClass(): string {
  return 'mx-auto w-full max-w-6xl'
}

/** Grille services : 1 col mobile, 2 cols tablette, 3 cols desktop */
export function serviceGridClass(): string {
  return 'grid w-full grid-cols-1 gap-5 @md:grid-cols-2 @md:gap-6 @lg:grid-cols-3'
}

/** Grille stats hero (centré) : empilé mobile → 2 cols tablette → 4 cols desktop */
export function heroStatGridCenteredClass(): string {
  return 'mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 @md:mt-14 @md:grid-cols-2 @md:gap-4 @lg:grid-cols-4'
}

/** Grille stats hero (sidebar) : empilé mobile → 2 cols dès tablette */
export function heroStatGridSidebarClass(): string {
  return 'grid w-full grid-cols-1 gap-3 @md:grid-cols-2 @md:gap-4'
}

/** Layout hero deux zones : empilé mobile, côte à côte desktop */
export function heroSplitLayoutClass(): string {
  return 'grid w-full grid-cols-1 items-center gap-8 @lg:grid-cols-12 @lg:gap-14'
}

/** Footer : empilé mobile, 2 cols tablette */
export function footerLayoutGridClass(): string {
  return 'grid w-full grid-cols-1 gap-8 @md:grid-cols-2 @lg:grid-cols-[1.5fr_1fr] @lg:items-center @lg:gap-12'
}

/** Carte pleine largeur sur mobile */
export function fullWidthOnMobileClass(): string {
  return 'w-full min-w-0'
}

export function contentAlignClass(align: AlignToken): string {
  const map = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }
  return ['flex flex-col gap-6 @sm:gap-8', map[align]].join(' ')
}

export function statCardClass(): string {
  return [
    'rounded-lg border border-[#1A3066]/10 bg-white p-4 @sm:p-5',
    'transition duration-200 hover:border-[#1A3066]/20',
  ].join(' ')
}

export function serviceCardClass(): string {
  return [
    'relative flex h-full flex-col rounded-xl border border-[#1A3066]/10 bg-white p-5 @sm:p-6',
    'transition duration-200 hover:border-[#1A3066]/18',
  ].join(' ')
}

export function featuredServiceCardClass(): string {
  return [
    'relative flex h-full flex-col rounded-xl border border-[#1A3066]/15 bg-white p-5 @sm:p-6',
    'border-l-[3px] border-l-[#E63946] transition duration-200 hover:border-[#1A3066]/22',
  ].join(' ')
}

export function ctaPanelClass(onDark: boolean): string {
  return [
    'rounded-xl border px-6 py-10 @sm:px-10 @sm:py-14 @lg:px-14',
    onDark ? 'border-white/10 bg-white/[0.03]' : 'border-[#1A3066]/10 bg-white',
  ].join(' ')
}

export function footerLinkClass(): string {
  return [
    'inline-flex min-h-11 items-center gap-2.5 text-sm font-medium opacity-90 transition duration-200',
    'hover:text-[#E63946] hover:opacity-100 @sm:text-base @sm:justify-end',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
  ].join(' ')
}

export function highlightClass(): string {
  return textClass.accent
}

/** Légère surcouche décorative du hero — respecte le fond palette */
export function heroBackgroundWashClass(style: BlockStyle): string {
  if (isDarkBackgroundValue(style.color.bg)) {
    return 'bg-gradient-to-b from-black/15 via-transparent to-black/25'
  }
  if (isPaletteToken(style.color.bg) && style.color.bg === 'white') {
    return 'bg-gradient-to-b from-white via-white/95 to-[#f8fafc]'
  }
  if (isWhiteishBackground(style.color.bg)) {
    return 'bg-gradient-to-b from-white via-white/95 to-[#f8fafc]'
  }
  return 'bg-gradient-to-b from-[#E3F2FD] via-[#f0f7fd] to-white'
}

/** Bordure de section adaptée au fond */
export function sectionBorderClass(style: BlockStyle): string {
  return isDarkBackgroundValue(style.color.bg) ? 'border-white/10' : 'border-[#1A3066]/10'
}

/** @deprecated */
export function eyebrowClass(style?: BlockStyle): string {
  const family = style?.font.family ?? 'poppins'
  return [typographyClass({ sizePx: 12, weight: 'medium', family }, 'eyebrow'), mutedClass()].join(' ')
}
