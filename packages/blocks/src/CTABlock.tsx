import type { BlockProps } from '@lp-studio/types'
import { resolveTypographyRole } from '@lp-studio/registry'
import {
  accentButtonClass,
  containerClass,
  ctaPanelClass,
  sectionSpacing,
  sectionTheme,
} from '@lp-studio/tokens'
import { EditableText } from './EditableText'
import { typoProps } from './typo'

export function CTABlock({ content, style, editable, onEdit }: BlockProps<'cta'>) {
  const centered = style.align === 'center'
  const onNavy = style.color.bg === 'navy'
  const typo = {
    h2: resolveTypographyRole('cta', style, 'h2'),
    body: resolveTypographyRole('cta', style, 'body'),
  }
  const t = {
    h2: typoProps(typo.h2, 'h2', 'max-w-2xl', centered ? 'mx-auto' : ''),
    body: typoProps(typo.body, 'body', 'max-w-2xl sm:mt-5', onNavy ? 'text-white/85' : 'text-[#5C6B8A]', centered ? 'mx-auto' : ''),
  }

  const ctaButton = editable ? (
    <span className={accentButtonClass(onNavy ? 'onDark' : 'default')}>
      <EditableText value={content.buttonLabel} field="buttonLabel" editable={editable} onEdit={onEdit} as="span" />
    </span>
  ) : (
    <a href={content.buttonHref} className={accentButtonClass(onNavy ? 'onDark' : 'default')}>
      {content.buttonLabel}
    </a>
  )

  return (
    <section id="contact" className={[sectionTheme(style), sectionSpacing(style), 'relative overflow-hidden'].join(' ')}>
      {onNavy ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1A3066] via-[#152a57] to-[#0f1f42]" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#E63946]/15 blur-3xl"
          />
        </>
      ) : null}

      <div className={`${containerClass()} relative z-10`}>
        <div className={[ctaPanelClass(onNavy), centered ? 'text-center' : 'text-left'].join(' ')}>
          <EditableText
            value={content.title}
            field="title"
            editable={editable}
            onEdit={onEdit}
            className={t.h2.className}
            style={t.h2.style}
            as="h2"
          />
          <EditableText
            value={content.description}
            field="description"
            editable={editable}
            onEdit={onEdit}
            multiline
            className={`mt-4 ${t.body.className}`}
            style={t.body.style}
            as="p"
          />
          <div className="mt-8 sm:mt-10">{ctaButton}</div>
        </div>
      </div>
    </section>
  )
}
