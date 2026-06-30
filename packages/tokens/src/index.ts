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
  xl: 'text-[2rem] leading-[1.08] sm:text-[2.75rem] lg:text-[3.5rem]',
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

export function sectionTheme(style: BlockStyle): string {
  return [bgClass[style.color.bg], textClass[style.color.text], animationClass[style.animation], fontClass[style.font.family]]
    .filter(Boolean)
    .join(' ')
}

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
    'tracking-tight text-balance',
  ].join(' ')
}

export function sectionTitleClass(style: BlockStyle): string {
  return [
    'text-2xl sm:text-3xl lg:text-4xl',
    weightClass.bold,
    fontClass[style.font.family],
    'leading-tight tracking-tight text-balance',
  ].join(' ')
}

export function sectionLabelClass(): string {
  return 'text-xs font-semibold uppercase tracking-[0.2em] text-[#E63946]'
}

export function bodyClass(style: BlockStyle): string {
  return ['text-base sm:text-lg leading-relaxed', weightClass.normal, fontClass[style.font.family]].join(' ')
}

export function mutedClass(): string {
  return 'text-[#5C6B8A]'
}

export function accentButtonClass(variant: 'default' | 'onDark' = 'default'): string {
  const base = [
    'inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3.5 sm:min-h-12 sm:px-8 sm:py-4',
    'text-sm sm:text-base font-semibold shadow-lg transition duration-200',
    'hover:translate-y-[-1px] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'cursor-pointer',
  ]

  if (variant === 'onDark') {
    return [
      ...base,
      'bg-[#E63946] text-white shadow-[#E63946]/30 hover:brightness-105 focus-visible:outline-white',
    ].join(' ')
  }

  return [
    ...base,
    'bg-[#E63946] text-white shadow-[#E63946]/25 hover:brightness-105 focus-visible:outline-[#1A3066]',
  ].join(' ')
}

export function ghostButtonClass(): string {
  return [
    'hidden min-h-11 items-center justify-center rounded-full border border-[#1A3066]/15 px-5 py-2.5',
    'text-sm font-semibold text-[#1A3066] transition duration-200',
    'hover:border-[#1A3066]/30 hover:bg-[#E3F2FD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3066]',
    'sm:inline-flex cursor-pointer',
  ].join(' ')
}

export function navBarClass(): string {
  return 'sticky top-0 z-30 border-b border-[#1A3066]/10 bg-white/90 shadow-sm shadow-[#1A3066]/5 backdrop-blur-md'
}

export function containerClass(): string {
  return 'mx-auto w-full max-w-6xl'
}

export function contentAlignClass(align: AlignToken): string {
  const map = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }
  return ['flex flex-col gap-6 sm:gap-8', map[align]].join(' ')
}

export function statCardClass(): string {
  return [
    'rounded-2xl border border-[#1A3066]/10 bg-white p-4 shadow-sm sm:p-5',
    'transition duration-200 hover:border-[#1A3066]/15 hover:shadow-md',
  ].join(' ')
}

export function serviceCardClass(): string {
  return [
    'flex h-full flex-col rounded-2xl border border-[#1A3066]/10 bg-white p-6 sm:p-7',
    'shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#1A3066]/15 hover:shadow-md',
  ].join(' ')
}

export function featuredServiceCardClass(): string {
  return [
    'relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E63946]/25 bg-white p-6 sm:p-7',
    'shadow-lg shadow-[#1A3066]/10 ring-1 ring-[#E63946]/10',
    'transition duration-200 hover:-translate-y-1 hover:shadow-xl',
  ].join(' ')
}

export function ctaPanelClass(onNavy: boolean): string {
  return [
    'rounded-2xl border px-6 py-10 sm:rounded-3xl sm:px-10 sm:py-14 lg:px-16',
    onNavy
      ? 'border-white/10 bg-white/[0.04] backdrop-blur-sm'
      : 'border-[#1A3066]/10 bg-white shadow-xl shadow-[#1A3066]/10',
  ].join(' ')
}

export function footerLinkClass(): string {
  return [
    'inline-flex min-h-11 items-center gap-2.5 text-sm font-medium opacity-90 transition duration-200',
    'hover:text-[#E63946] hover:opacity-100 sm:text-base sm:justify-end',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
  ].join(' ')
}

export function highlightClass(): string {
  return 'text-[#E63946]'
}

export function eyebrowClass(): string {
  return 'text-xs font-semibold uppercase tracking-[0.2em] text-[#5C6B8A] sm:text-sm'
}
