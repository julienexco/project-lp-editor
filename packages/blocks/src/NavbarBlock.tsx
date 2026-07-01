import type { BlockProps } from '@lp-studio/types'
import {
  containerClass,
  navBarFixedClass,
  navBarSpacerClass,
  navBarStickyClass,
  navCtaButtonClass,
  sectionColorStyle,
} from '@lp-studio/tokens'
import { BrandLogo } from './BrandLogo'
import { EditableText } from './EditableText'

export function NavbarBlock({ content, style, editable, onEdit, onStyleEdit }: BlockProps<'navbar'>) {
  if (!content.showLogo) return null

  const shellClass = editable ? navBarStickyClass() : navBarFixedClass()

  const navCta = editable ? (
    <span className={navCtaButtonClass()}>
      <EditableText
        value={content.ctaLabel}
        field="ctaLabel"
        editable={editable}
        onEdit={onEdit}
        onStyleEdit={onStyleEdit}
        typographyRole="body"
        className="text-white"
        as="span"
      />
    </span>
  ) : (
    <a href={content.ctaHref} className={navCtaButtonClass()}>
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
