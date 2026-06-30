import type { BlockProps } from '@lp-studio/types'
import {
  accentButtonClass,
  bodyClass,
  containerClass,
  contentAlignClass,
  eyebrowClass,
  headingClass,
  highlightClass,
  mutedClass,
  sectionSpacing,
  sectionTheme,
  statCardClass,
} from '@lp-studio/tokens'

const LOGO_PATH = '/brand/logo-upscaly-consulting.png'

export function HeroBlock({ content, style }: BlockProps<'hero'>) {
  const isSurface = style.color.bg === 'surface' || style.color.bg === 'white'

  return (
    <section
      className={[
        'relative overflow-hidden',
        sectionTheme(style),
        sectionSpacing(style),
        'min-h-[85vh] flex items-center',
      ].join(' ')}
    >
      {isSurface ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#E3F2FD] via-white to-[#E3F2FD]/60"
        />
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#1A3066]/5 blur-3xl sm:h-96 sm:w-96"
      />

      <div className={`${containerClass()} relative z-10 w-full`}>
        <div className={contentAlignClass(style.align)}>
          {content.showLogo ? (
            <img
              src={LOGO_PATH}
              alt={content.eyebrow}
              className="h-12 w-auto sm:h-14 lg:h-16"
            />
          ) : null}

          <div className={style.align === 'center' ? 'mx-auto max-w-4xl' : 'max-w-4xl'}>
            <p className={eyebrowClass()}>{content.eyebrow}</p>
            <h1 className={`mt-4 sm:mt-6 ${headingClass(style)}`}>
              {content.title}
              <span className={`block ${highlightClass()}`}>{content.titleHighlight}</span>
            </h1>
            <p className={`mt-5 max-w-2xl sm:mt-6 ${bodyClass(style)} ${mutedClass()}`}>
              {content.subtitle}
            </p>
          </div>

          <a href={content.ctaHref} className={accentButtonClass(style.align)}>
            {content.ctaLabel}
          </a>

          <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {content.stats.map((stat) => (
              <div key={stat.label} className={statCardClass()}>
                <p className="text-2xl font-bold text-[#1A3066] sm:text-3xl">{stat.value}</p>
                <p className={`mt-1 text-xs sm:text-sm ${mutedClass()}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
