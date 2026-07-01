import type { BlockStyle, BlockType } from '@lp-studio/types'

type FieldType = 'string' | 'url' | 'boolean' | 'stats' | 'featureItems'

type FieldDef = {
  type: FieldType
  label: string
  default?: unknown
}

export type BlockDefinition = {
  label: string
  contentSchema: Record<string, FieldDef>
  defaultStyle: BlockStyle
}

export const defaultBlockStyle: BlockStyle = {
  align: 'left',
  color: { bg: 'surface', text: 'navy' },
  font: { family: 'poppins', size: 'md', weight: 'normal' },
  typography: {},
  spacing: { marginY: 'normal', paddingX: 'normal' },
  animation: 'none',
}

export const blockRegistry = {
  navbar: {
    label: 'Header',
    contentSchema: {
      brandAlt: { type: 'string', label: 'Texte alternatif logo', default: '' },
      ctaLabel: { type: 'string', label: 'Bouton navigation', default: '' },
      ctaHref: { type: 'url', label: 'Lien navigation', default: '#' },
      showLogo: { type: 'boolean', label: 'Afficher le header', default: true },
    },
    defaultStyle: {
      ...defaultBlockStyle,
      color: { bg: 'white', text: 'navy' },
      font: { family: 'poppins', size: 'sm', weight: 'medium' },
      spacing: { marginY: 'tight', paddingX: 'normal' },
    },
  },
  hero: {
    label: 'Hero',
    contentSchema: {
      eyebrow: { type: 'string', label: 'Eyebrow', default: '' },
      title: { type: 'string', label: 'Titre ligne 1', default: '' },
      titleHighlight: { type: 'string', label: 'Titre ligne 2 (accent)', default: '' },
      subtitle: { type: 'string', label: 'Sous-titre', default: '' },
      ctaLabel: { type: 'string', label: 'Bouton CTA', default: '' },
      ctaHref: { type: 'url', label: 'Lien CTA', default: '#' },
      stats: { type: 'stats', label: 'Chiffres clés', default: [] },
    },
    defaultStyle: {
      ...defaultBlockStyle,
      color: { bg: 'surface', text: 'navy' },
      font: { family: 'poppins', size: 'xl', weight: 'bold' },
      spacing: { marginY: 'loose', paddingX: 'normal' },
      animation: 'fade-in',
    },
  },
  featureGrid: {
    label: 'Services',
    contentSchema: {
      sectionTitle: { type: 'string', label: 'Titre section', default: '' },
      items: { type: 'featureItems', label: 'Cartes services', default: [] },
    },
    defaultStyle: {
      ...defaultBlockStyle,
      color: { bg: 'white', text: 'navy' },
    },
  },
  cta: {
    label: 'CTA',
    contentSchema: {
      title: { type: 'string', label: 'Titre', default: '' },
      description: { type: 'string', label: 'Description', default: '' },
      buttonLabel: { type: 'string', label: 'Bouton', default: '' },
      buttonHref: { type: 'url', label: 'Lien', default: '#' },
    },
    defaultStyle: {
      ...defaultBlockStyle,
      align: 'center',
      color: { bg: 'navy', text: 'white' },
      font: { family: 'poppins', size: 'lg', weight: 'bold' },
      spacing: { marginY: 'loose', paddingX: 'normal' },
    },
  },
  footer: {
    label: 'Footer',
    contentSchema: {
      brandName: { type: 'string', label: 'Marque', default: '' },
      email: { type: 'string', label: 'Email', default: '' },
      linkedinUrl: { type: 'url', label: 'LinkedIn URL', default: '' },
      linkedinLabel: { type: 'string', label: 'Label LinkedIn', default: 'LinkedIn' },
      copyright: { type: 'string', label: 'Copyright', default: '' },
      showLogo: { type: 'boolean', label: 'Afficher le logo', default: true },
    },
    defaultStyle: {
      ...defaultBlockStyle,
      color: { bg: 'navy', text: 'white' },
      font: { family: 'poppins', size: 'sm', weight: 'normal' },
      spacing: { marginY: 'tight', paddingX: 'normal' },
    },
  },
} as const satisfies Record<BlockType, BlockDefinition>

export const blockTypes = Object.keys(blockRegistry) as BlockType[]
