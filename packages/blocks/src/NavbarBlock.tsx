import type { BlockProps } from '@lp-studio/types'
import { resolveTypographyRole } from '@lp-studio/registry'
import {
  containerClass,
  ghostButtonClass,
  navBarFixedClass,
  navBarSpacerClass,
  navBarStickyClass,
  primaryTextClass,
  sectionColorStyle,
} from '@lp-studio/tokens'
import { BrandLogo } from './BrandLogo'
import { EditableText } from './EditableText'
import { typoProps } from './typo'

export function NavbarBlock({ content, style, editable, onEdit, onStyleEdit }: BlockProps<'navbar'>) {
  if (!content.showLogo) return null

  const typo = resolveTypographyRole('navbar', style, 'body')
  const t = typoProps(typo, 'body', primaryTextClass(style))
  const shellClass = editable ? navBarStickyClass() : navBarFixedClass()

  const navCta = editable ? (
    <span className={ghostButtonClass()}>
      <EditableText
        value={content.ctaLabel}
        field="ctaLabel"
        editable={editable}
        onEdit={onEdit}
        onStyleEdit={onStyleEdit}
        typographyRole="body"
        className={t.className}
        style={t.style}
        as="span"
      />
    </span>
  ) : (
    <a href={content.ctaHref} className={ghostButtonClass()}>
      {content.ctaLabel}
    </a>
  )

  return (
    <>
      <header className={shellClass} style={sectionColorStyle(style)} data-block-section="navbar">
        <div
          className={`${containerClass()} flex flex-wrap items-center justify-between gap-3 px-4 py-3 @sm:gap-4 @sm:py-3.5 @sm:px-6 @lg:px-8`}
        >
          <BrandLogo alt={content.brandAlt} variant="nav" />
          {navCta}
        </div>
      </header>
      {!editable ? <div aria-hidden className={navBarSpacerClass()} /> : null}
    </>
  )
}
