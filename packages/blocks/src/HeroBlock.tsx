import type { BlockProps } from '@lp-studio/types'
import { resolveTypographyRole } from '@lp-studio/registry'
import {
  accentButtonClass,
  containerClass,
  ghostButtonClass,
  highlightClass,
  mutedClass,
  navBarClass,
  sectionSpacing,
  sectionTheme,
  statCardClass,
} from '@lp-studio/tokens'
import { BrandLogo } from './BrandLogo'
import { AccentBar, HeroGridPattern } from './decorations'
import { EditableText } from './EditableText'
import { typoProps } from './typo'

export function HeroBlock({ content, style, editable, onEdit }: BlockProps<'hero'>) {
  const centered = style.align === 'center'
  const typo = {
    eyebrow: resolveTypographyRole('hero', style, 'eyebrow'),
    h1: resolveTypographyRole('hero', style, 'h1'),
    body: resolveTypographyRole('hero', style, 'body'),
    stat: resolveTypographyRole('hero', style, 'stat'),
    caption: resolveTypographyRole('hero', style, 'caption'),
  }
  const t = {
    eyebrow: typoProps(typo.eyebrow, 'eyebrow', mutedClass()),
    h1: typoProps(typo.h1, 'h1'),
    body: typoProps(typo.body, 'body', mutedClass()),
    stat: typoProps(typo.stat, 'stat', 'text-[#1A3066]'),
    caption: typoProps(typo.caption, 'caption', mutedClass()),
  }

  const ctaButton = editable ? (
    <span className={accentButtonClass()}>
      <EditableText value={content.ctaLabel} field="ctaLabel" editable={editable} onEdit={onEdit} as="span" />
    </span>
  ) : (
    <a href={content.ctaHref} className={accentButtonClass()}>
      {content.ctaLabel}
    </a>
  )

  const navCta = editable ? (
    <span className={ghostButtonClass()}>
      <EditableText value={content.ctaLabel} field="ctaLabel" editable={editable} onEdit={onEdit} as="span" />
    </span>
  ) : (
    <a href={content.ctaHref} className={ghostButtonClass()}>
      {content.ctaLabel}
    </a>
  )

  const statCards = (highlightFirst: boolean) =>
    content.stats.map((stat, index) => (
      <div
        key={`stat-${index}`}
        className={[statCardClass(), highlightFirst && index === 0 ? 'border-[#E63946]/20 bg-[#E3F2FD]/40' : ''].join(' ')}
      >
        <EditableText
          value={stat.value}
          field={`stats.${index}.value`}
          editable={editable}
          onEdit={onEdit}
          className={t.stat.className}
          style={t.stat.style}
          as="p"
        />
        <EditableText
          value={stat.label}
          field={`stats.${index}.label`}
          editable={editable}
          onEdit={onEdit}
          className={`mt-1 ${t.caption.className}`}
          style={t.caption.style}
          as="p"
        />
      </div>
    ))

  const titleBlock = (
    <>
      <EditableText
        value={content.title}
        field="title"
        editable={editable}
        onEdit={onEdit}
        className={t.h1.className}
        style={t.h1.style}
        as="span"
      />
      <EditableText
        value={content.titleHighlight}
        field="titleHighlight"
        editable={editable}
        onEdit={onEdit}
        className={[centered ? `mt-2 block ${highlightClass()}` : highlightClass(), t.h1.className].join(' ')}
        style={t.h1.style}
        as="span"
      />
    </>
  )

  return (
    <section className={[sectionTheme(style), 'relative overflow-hidden'].join(' ')}>
      <HeroGridPattern />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#E3F2FD] via-white/95 to-white" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-[#E63946]/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#1A3066]/[0.05] blur-3xl"
      />

      {content.showLogo ? (
        <header className={navBarClass()}>
          <div className={`${containerClass()} flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8`}>
            <BrandLogo alt={content.eyebrow} variant="nav" />
            {navCta}
          </div>
        </header>
      ) : null}

      <div className={[sectionSpacing(style), 'relative z-10'].join(' ')}>
        <div className={containerClass()}>
          {centered ? (
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="mb-5 flex flex-col items-center gap-3">
                <AccentBar />
                <EditableText
                  value={content.eyebrow}
                  field="eyebrow"
                  editable={editable}
                  onEdit={onEdit}
                  className={t.eyebrow.className}
                  style={t.eyebrow.style}
                  as="p"
                />
              </div>
              <h1 className={t.h1.className} style={t.h1.style}>
                {titleBlock}
              </h1>
              <EditableText
                value={content.subtitle}
                field="subtitle"
                editable={editable}
                onEdit={onEdit}
                multiline
                className={`mt-6 max-w-2xl sm:mt-7 ${t.body.className}`}
                style={t.body.style}
                as="p"
              />
              <div className="mt-8 sm:mt-10">{ctaButton}</div>
              <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-4">
                {statCards(false)}
              </div>
            </div>
          ) : (
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="space-y-6 sm:space-y-8 lg:col-span-7">
                <div className="flex flex-col gap-3">
                  <AccentBar />
                  <EditableText
                    value={content.eyebrow}
                    field="eyebrow"
                    editable={editable}
                    onEdit={onEdit}
                    className={t.eyebrow.className}
                    style={t.eyebrow.style}
                    as="p"
                  />
                </div>
                <h1 className={t.h1.className} style={t.h1.style}>
                  {titleBlock}
                </h1>
                <EditableText
                  value={content.subtitle}
                  field="subtitle"
                  editable={editable}
                  onEdit={onEdit}
                  multiline
                  className={`max-w-xl ${t.body.className}`}
                  style={t.body.style}
                  as="p"
                />
                {ctaButton}
              </div>
              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">{statCards(true)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
