import type {
  AlignToken,
  AnimationToken,
  BlockStyle,
  FontFamilyToken,
  PaletteToken,
  SizeToken,
  SpacingToken,
  WeightToken,
} from '@lp-studio/types'

export const brandColors = {
  navy: '#1A3066',
  surface: '#E3F2FD',
  white: '#FFFFFF',
  accent: '#E63946',
  navyMuted: '#5C6B8A',
} as const

export const paletteTokens = ['navy', 'surface', 'white', 'accent', 'navyMuted'] as const

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

const marginYClass: Record<SpacingToken, string> = {
  tight: 'py-12 sm:py-14',
  normal: 'py-16 sm:py-20',
  loose: 'py-20 sm:py-24 lg:py-28',
  xl: 'py-24 sm:py-28 lg:py-32',
}

const paddingXClass: Record<SpacingToken, string> = {
  tight: 'px-4 sm:px-6',
  normal: 'px-4 sm:px-6 lg:px-8',
  loose: 'px-4 sm:px-8 lg:px-12',
  xl: 'px-4 sm:px-10 lg:px-16',
}

const sizeClass: Record<SizeToken, string> = {
  sm: 'text-sm sm:text-base',
  md: 'text-base sm:text-lg',
  lg: 'text-2xl sm:text-3xl lg:text-4xl',
  xl: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
}

const weightClass: Record<WeightToken, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold',
}

const fontClass: Record<FontFamilyToken, string> = {
  poppins: 'font-[family-name:var(--font-poppins)]',
}

const animationClass: Record<AnimationToken, string> = {
  none: '',
  'fade-in': 'animate-in fade-in duration-700',
  'slide-up': 'animate-in fade-in slide-in-from-bottom-4 duration-700',
}

const alignItemsClass: Record<AlignToken, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

const alignSelfClass: Record<AlignToken, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
}

/** Fond + couleur texte + animation (niveau section) */
export function sectionTheme(style: BlockStyle): string {
  return [bgClass[style.color.bg], textClass[style.color.text], animationClass[style.animation], fontClass[style.font.family]]
    .filter(Boolean)
    .join(' ')
}

/** Espacement responsive section */
export function sectionSpacing(style: BlockStyle): string {
  return [marginYClass[style.spacing.marginY], paddingXClass[style.spacing.paddingX]].join(' ')
}

/** @deprecated use sectionTheme + sectionSpacing */
export function applyBlockStyle(style: BlockStyle): string {
  return [sectionTheme(style), sectionSpacing(style)].join(' ')
}

export function headingClass(style: BlockStyle): string {
  return [
    sizeClass[style.font.size],
    weightClass[style.font.weight],
    fontClass[style.font.family],
    'leading-[1.1] tracking-tight',
  ].join(' ')
}

export function sectionTitleClass(style: BlockStyle): string {
  return [
    'text-2xl sm:text-3xl lg:text-4xl',
    weightClass.bold,
    fontClass[style.font.family],
    'leading-tight tracking-tight',
  ].join(' ')
}

export function bodyClass(style: BlockStyle): string {
  return ['text-base sm:text-lg leading-relaxed', weightClass.normal, fontClass[style.font.family]].join(' ')
}

export function mutedClass(): string {
  return 'text-[#5C6B8A]'
}

export function accentButtonClass(align: AlignToken = 'left'): string {
  const alignBtn =
    align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
  return [
    'inline-flex items-center justify-center rounded-full bg-[#E63946] px-7 py-3.5 sm:px-8 sm:py-4',
    'text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#E63946]/25',
    'transition hover:translate-y-[-1px] hover:shadow-xl hover:brightness-105',
    alignBtn,
  ].join(' ')
}

export function containerClass(): string {
  return 'mx-auto w-full max-w-6xl'
}

export function contentAlignClass(align: AlignToken): string {
  return ['flex flex-col gap-6 sm:gap-8', alignItemsClass[align]].join(' ')
}

export function contentWidthClass(align: AlignToken): string {
  return ['w-full max-w-3xl', alignSelfClass[align]].join(' ')
}

export function statCardClass(): string {
  return 'rounded-2xl border border-[#1A3066]/10 bg-white/80 p-4 sm:p-5 shadow-sm backdrop-blur-sm'
}

export function serviceCardClass(): string {
  return [
    'flex h-full flex-col rounded-2xl border border-[#1A3066]/10 bg-white p-6 sm:p-8',
    'shadow-sm transition hover:-translate-y-0.5 hover:border-[#1A3066]/20 hover:shadow-md',
  ].join(' ')
}

export function highlightClass(): string {
  return 'text-[#E63946]'
}

export function eyebrowClass(): string {
  return 'text-xs font-medium uppercase tracking-[0.2em] text-[#5C6B8A] sm:text-sm'
}
