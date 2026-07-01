import type { BlockProps } from '@lp-studio/types'
import { resolveTypographyRole } from '@lp-studio/registry'
import {
  accentButtonClass,
  cardPrimaryTextClass,
  cardSecondaryTextClass,
  containerClass,
  highlightClass,
  heroBackgroundWashClass,
  primaryTextClass,
  secondaryTextClass,
  sectionSpacing,
  sectionColorStyle,
  sectionTheme,
  statCardClass,
} from '@lp-studio/tokens'
import { BrandLogo } from './BrandLogo'
import { AccentBar, HeroGridPattern } from './decorations'
import { EditableText } from './EditableText'
import { typoProps } from './typo'

export function HeroBlock({ content, style, editable, onEdit, onStyleEdit }: BlockProps<'hero'>) {
  const centered = style.align === 'center'
  const typo = {
    eyebrow: resolveTypographyRole('hero', style, 'eyebrow'),
    h1: resolveTypographyRole('hero', style, 'h1'),
    body: resolveTypographyRole('hero', style, 'body'),
    stat: resolveTypographyRole('hero', style, 'stat'),
    caption: resolveTypographyRole('hero', style, 'caption'),
  }
  const t = {
    eyebrow: typoProps(typo.eyebrow, 'eyebrow', secondaryTextClass(style)),
    h1: typoProps(typo.h1, 'h1', primaryTextClass(style)),
    body: typoProps(typo.body, 'body', secondaryTextClass(style)),
    stat: typoProps(typo.stat, 'stat', cardPrimaryTextClass()),
    caption: typoProps(typo.caption, 'caption', cardSecondaryTextClass()),
  }

  const ctaButton = editable ? (
    <span className={accentButtonClass()}>
      <EditableText value={content.ctaLabel} field="ctaLabel" editable={editable} onEdit={onEdit} onStyleEdit={onStyleEdit} typographyRole="body" as="span" />
    </span>
  ) : (
    <a href={content.ctaHref} className={accentButtonClass()}>
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
          onStyleEdit={onStyleEdit}
          typographyRole="stat"
          className={t.stat.className}
          style={t.stat.style}
          as="p"
        />
        <EditableText
          value={stat.label}
          field={`stats.${index}.label`}
          editable={editable}
          onEdit={onEdit}
          onStyleEdit={onStyleEdit}
          typographyRole="caption"
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
        onStyleEdit={onStyleEdit}
        typographyRole="h1"
        className={t.h1.className}
        style={t.h1.style}
        as="span"
      />
      <EditableText
        value={content.titleHighlight}
        field="titleHighlight"
        editable={editable}
        onEdit={onEdit}
        onStyleEdit={onStyleEdit}
        typographyRole="h1"
        className={[centered ? `mt-2 block ${highlightClass()}` : `block @max-sm:mt-2 @sm:inline ${highlightClass()}`, t.h1.className].join(' ')}
        style={t.h1.style}
        as="span"
      />
    </>
  )

  return (
    <section className={[sectionTheme(style), 'relative overflow-hidden'].join(' ')} style={sectionColorStyle(style)}>
      <HeroGridPattern />
      <div aria-hidden className={['pointer-events-none absolute inset-0', heroBackgroundWashClass(style)].join(' ')} />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-[#E63946]/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#1A3066]/[0.05] blur-3xl"
      />

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
                  onStyleEdit={onStyleEdit}
                  typographyRole="eyebrow"
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
                onStyleEdit={onStyleEdit}
                typographyRole="body"
                multiline
                className={`mt-6 max-w-2xl @sm:mt-7 ${t.body.className}`}
                style={t.body.style}
                as="p"
              />
              <div className="mt-8 flex w-full @sm:mt-10 @sm:w-auto">{ctaButton}</div>
              <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 @md:grid-cols-4 @sm:mt-14 @sm:gap-4">
                {statCards(false)}
              </div>
            </div>
          ) : (
            <div className="grid items-center gap-8 @lg:grid-cols-12 @lg:gap-14">
              <div className="space-y-6 @sm:space-y-8 @lg:col-span-7">
                <div className="flex flex-col gap-3">
                  <AccentBar />
                  <EditableText
                    value={content.eyebrow}
                    field="eyebrow"
                    editable={editable}
                    onEdit={onEdit}
                    onStyleEdit={onStyleEdit}
                    typographyRole="eyebrow"
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
                  onStyleEdit={onStyleEdit}
                  typographyRole="body"
                  multiline
                  className={`max-w-xl ${t.body.className}`}
                  style={t.body.style}
                  as="p"
                />
        <div className="mt-8 w-full @sm:mt-10 @sm:w-auto">{ctaButton}</div>
              </div>
              <div className="@lg:col-span-5">
                <div className="grid grid-cols-2 gap-3 @sm:gap-4">{statCards(true)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
