export type BlockType = 'hero' | 'featureGrid' | 'cta' | 'footer'

export type PaletteToken = 'navy' | 'surface' | 'white' | 'accent' | 'navyMuted'
export type FontFamilyToken =
  | 'poppins'
  | 'inter'
  | 'open-sans'
  | 'roboto'
  | 'montserrat'
  | 'playfair-display'
  | 'lora'
export type SizeToken = 'sm' | 'md' | 'lg' | 'xl'
export type WeightToken = 'normal' | 'medium' | 'bold'
export type SpacingToken = 'tight' | 'normal' | 'loose' | 'xl'
export type AlignToken = 'left' | 'center' | 'right'
export type AnimationToken = 'none' | 'fade-in' | 'slide-up'

export type TypographyRole = 'h1' | 'h2' | 'h3' | 'eyebrow' | 'body' | 'caption' | 'stat'

export type TypographyRoleStyle = {
  sizePx: number
  weight: WeightToken
  family: FontFamilyToken
}

export type TypographyTheme = Partial<Record<TypographyRole, TypographyRoleStyle>>

export type BlockStyle = {
  align: AlignToken
  color: { bg: PaletteToken; text: PaletteToken }
  font: { family: FontFamilyToken; size: SizeToken; weight: WeightToken }
  typography: TypographyTheme
  spacing: { marginY: SpacingToken; paddingX: SpacingToken }
  animation: AnimationToken
}

export type StatItem = { value: string; label: string }

export type FeatureItem = {
  title: string
  tagline: string
  description: string
}

export type HeroContent = {
  eyebrow: string
  title: string
  titleHighlight: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  showLogo: boolean
  stats: StatItem[]
}

export type FeatureGridContent = {
  sectionTitle: string
  items: FeatureItem[]
}

export type CtaContent = {
  title: string
  description: string
  buttonLabel: string
  buttonHref: string
}

export type FooterContent = {
  brandName: string
  email: string
  linkedinUrl: string
  linkedinLabel: string
  copyright: string
  showLogo: boolean
}

export type BlockContentMap = {
  hero: HeroContent
  featureGrid: FeatureGridContent
  cta: CtaContent
  footer: FooterContent
}

export type BlockInstance<T extends BlockType = BlockType> = {
  id: string
  type: T
  content: BlockContentMap[T]
  style: BlockStyle
  order: number
}

export type PageRecord = {
  id: string
  name: string
  slug: string
  domain?: string | null
  status: 'draft' | 'published'
  blocks: BlockInstance[]
  config: Record<string, unknown>
  meta: Record<string, unknown>
  schema_version: string
  updated_at?: string
}

export type ContentEditHandler = (field: string, value: string) => void

export type BlockProps<T extends BlockType> = {
  content: BlockContentMap[T]
  style: BlockStyle
  editable?: boolean
  onEdit?: ContentEditHandler
}
