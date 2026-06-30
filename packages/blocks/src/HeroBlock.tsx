import type { BlockProps } from '@lp-studio/types'
import {
  accentButtonClass,
  containerClass,
  eyebrowClass,
  ghostButtonClass,
  headingClass,
  highlightClass,
  mutedClass,
  sectionSpacing,
  sectionTheme,
  statCardClass,
} from '@lp-studio/tokens'
import { BrandLogo } from './BrandLogo'

export function HeroBlock({ content, style }: BlockProps<'hero'>) {
  const centered = style.align === 'center'

  return (
    <section className={[sectionTheme(style), 'relative overflow-hidden'].join(' ')}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#E3F2FD] via-white to-white" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-[#1A3066]/[0.04] blur-3xl"
      />

      {content.showLogo ? (
        <header className="relative z-20 border-b border-[#1A3066]/10 bg-white/80 backdrop-blur-md">
          <div className={`${containerClass()} flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8`}>
            <BrandLogo alt={content.eyebrow} variant="nav" />
            <a href={content.ctaHref} className={ghostButtonClass()}>
              {content.ctaLabel}
            </a>
          </div>
        </header>
      ) : null}

      <div className={[sectionSpacing(style), 'relative z-10'].join(' ')}>
        <div className={containerClass()}>
          <div
            className={[
              'grid items-center gap-10 lg:grid-cols-12 lg:gap-12',
              centered ? 'text-center' : 'text-left',
            ].join(' ')}
          >
            <div className={[centered ? 'lg:col-span-10 lg:col-start-2' : 'lg:col-span-7', 'space-y-6 sm:space-y-8'].join(' ')}>
              <p className={eyebrowClass()}>{content.eyebrow}</p>
              <h1 className={headingClass(style)}>
                {content.title}{' '}
                <span className={highlightClass()}>{content.titleHighlight}</span>
              </h1>
              <p className={`max-w-2xl text-base leading-relaxed sm:text-lg ${mutedClass()} ${centered ? 'mx-auto' : ''}`}>
                {content.subtitle}
              </p>
              <div className={`flex flex-wrap items-center gap-4 ${centered ? 'justify-center' : ''}`}>
                <a href={content.ctaHref} className={accentButtonClass()}>
                  {content.ctaLabel}
                </a>
              </div>
            </div>

            <div className={centered ? 'lg:col-span-10 lg:col-start-2' : 'lg:col-span-5'}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {content.stats.map((stat) => (
                  <div key={stat.label} className={statCardClass()}>
                    <p className="text-2xl font-bold tracking-tight text-[#1A3066] sm:text-3xl">{stat.value}</p>
                    <p className={`mt-1 text-xs leading-snug sm:text-sm ${mutedClass()}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
