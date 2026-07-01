import type { BlockProps } from '@lp-studio/types'
import { resolveTypographyRole } from '@lp-studio/registry'
import {
  cardPrimaryTextClass,
  cardSecondaryTextClass,
  containerClass,
  featuredServiceCardClass,
  footerLayoutGridClass,
  fullWidthOnMobileClass,
  primaryTextClass,
  secondaryTextClass,
  sectionSpacing,
  sectionColorStyle,
  sectionTheme,
  serviceCardClass,
  serviceGridClass,
} from '@lp-studio/tokens'
import { AccentBar, ServiceIcon } from './decorations'
import { EditableText } from './EditableText'
import { typoProps } from './typo'

export function FeatureGridBlock({ content, style, editable, onEdit, onStyleEdit }: BlockProps<'featureGrid'>) {
  const centered = style.align === 'center'
  const featuredIndex = Math.min(1, content.items.length - 1)
  const typo = {
    h2: resolveTypographyRole('featureGrid', style, 'h2'),
    h3: resolveTypographyRole('featureGrid', style, 'h3'),
    eyebrow: resolveTypographyRole('featureGrid', style, 'eyebrow'),
    body: resolveTypographyRole('featureGrid', style, 'body'),
  }
  const t = {
    h2: typoProps(typo.h2, 'h2', primaryTextClass(style)),
    h3: typoProps(typo.h3, 'h3', cardPrimaryTextClass()),
    eyebrow: typoProps(typo.eyebrow, 'eyebrow', cardSecondaryTextClass()),
    body: typoProps(typo.body, 'body', cardSecondaryTextClass()),
  }

  const serviceIcons = ['audit', 'strategy', 'execute', 'channel', 'stack', 'toolkit'] as const

  return (
    <section className={[sectionTheme(style), sectionSpacing(style), 'relative'].join(' ')} style={sectionColorStyle(style)}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1A3066]/10 to-transparent" />
      <div className={containerClass()}>
        <div
          className={[
            'mb-10 flex flex-col gap-4 @sm:mb-14',
            centered ? 'mx-auto max-w-2xl items-center text-center' : 'max-w-2xl',
          ].join(' ')}
        >
          <AccentBar />
          <EditableText
            value={content.sectionTitle}
            field="sectionTitle"
            editable={editable}
            onEdit={onEdit}
            onStyleEdit={onStyleEdit}
            typographyRole="h2"
            className={t.h2.className}
            style={t.h2.style}
            as="h2"
          />
        </div>

        <div className={serviceGridClass()}>
          {content.items.map((item, index) => (
            <article
              key={`item-${index}`}
              className={[index === featuredIndex ? featuredServiceCardClass() : serviceCardClass(), fullWidthOnMobileClass()].join(' ')}
            >
              <span
                className={[
                  'inline-flex h-10 w-10 items-center justify-center rounded-lg border',
                  index === featuredIndex
                    ? 'border-[#1A3066] bg-[#1A3066] text-white'
                    : 'border-[#1A3066]/12 bg-white text-[#1A3066]',
                ].join(' ')}
              >
                <ServiceIcon variant={serviceIcons[index % serviceIcons.length]} />
              </span>
              <EditableText
                value={item.title}
                field={`items.${index}.title`}
                editable={editable}
                onEdit={onEdit}
                onStyleEdit={onStyleEdit}
                typographyRole="h3"
                className={`mt-5 ${t.h3.className}`}
                style={t.h3.style}
                as="h3"
              />
              <EditableText
                value={item.tagline}
                field={`items.${index}.tagline`}
                editable={editable}
                onEdit={onEdit}
                onStyleEdit={onStyleEdit}
                typographyRole="eyebrow"
                className={`mt-2 ${t.eyebrow.className}`}
                style={t.eyebrow.style}
                as="p"
              />
              <EditableText
                value={item.description}
                field={`items.${index}.description`}
                editable={editable}
                onEdit={onEdit}
                onStyleEdit={onStyleEdit}
                typographyRole="body"
                multiline
                className={`mt-4 flex-1 ${t.body.className}`}
                style={t.body.style}
                as="p"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
