const LOGO_PATH = '/brand/logo-upscaly-consulting.png'

type BrandLogoProps = {
  alt: string
  variant?: 'nav' | 'footer'
}

const sizes = {
  nav: { height: 40, maxWidth: 200 },
  footer: { height: 36, maxWidth: 180 },
} as const

export function BrandLogo({ alt, variant = 'nav' }: BrandLogoProps) {
  const { height, maxWidth } = sizes[variant]

  return (
    <img
      src={LOGO_PATH}
      alt={alt}
      width={maxWidth}
      height={height}
      style={{
        height,
        maxWidth,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        ...(variant === 'footer' ? { filter: 'brightness(0) invert(1)' } : {}),
      }}
    />
  )
}
