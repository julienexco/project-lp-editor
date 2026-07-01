import type { BlockProps } from '@lp-studio/types'
import { resolveTypographyRole } from '@lp-studio/registry'
import { containerClass, footerLayoutGridClass, footerLinkClass, primaryTextClass, secondaryTextClass, sectionBorderClass, sectionColorStyle, sectionSpacing, sectionTheme } from '@lp-studio/tokens'
import { BrandLogo } from './BrandLogo'
import { LinkIcon, MailIcon } from './decorations'
import { EditableText } from './EditableText'
import { typoProps } from './typo'

export function FooterBlock({ content, style, editable, onEdit, onStyleEdit }: BlockProps<'footer'>) {
  const typo = {
    body: resolveTypographyRole('footer', style, 'body'),
    caption: resolveTypographyRole('footer', style, 'caption'),
  }
  const t = {
    body: typoProps(typo.body, 'body', primaryTextClass(style)),
    caption: typoProps(typo.caption, 'caption', 'max-w-md', secondaryTextClass(style)),
  }

  return (
    <footer className={[sectionTheme(style), sectionSpacing(style), 'relative border-t', sectionBorderClass(style)].join(' ')} style={sectionColorStyle(style)}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E63946] via-[#E63946]/50 to-transparent" />
      <div className={containerClass()}>
        <div className={footerLayoutGridClass()}>
          <div className="space-y-4">
            {content.showLogo ? (
              <BrandLogo alt={content.brandName} variant="footer" />
            ) : (
              <EditableText
                value={content.brandName}
                field="brandName"
                editable={editable}
                onEdit={onEdit}
                onStyleEdit={onStyleEdit}
                typographyRole="body"
                className={t.body.className}
                style={t.body.style}
                as="p"
              />
            )}
            <EditableText
              value={content.copyright}
              field="copyright"
              editable={editable}
              onEdit={onEdit}
              onStyleEdit={onStyleEdit}
              typographyRole="caption"
              className={t.caption.className}
              style={t.caption.style}
              as="p"
            />
          </div>

          <div className="flex flex-col gap-3 @sm:items-end">
            {editable ? (
              <span className={footerLinkClass()}>
                <MailIcon />
                <EditableText
                  value={content.email}
                  field="email"
                  editable={editable}
                  onEdit={onEdit}
                  onStyleEdit={onStyleEdit}
                  typographyRole="body"
                  className={t.body.className}
                  style={t.body.style}
                  as="span"
                />
              </span>
            ) : (
              <a href={`mailto:${content.email}`} className={footerLinkClass()}>
                <MailIcon />
                {content.email}
              </a>
            )}
            {editable ? (
              <span className={footerLinkClass()}>
                <LinkIcon />
                <EditableText
                  value={content.linkedinLabel}
                  field="linkedinLabel"
                  editable={editable}
                  onEdit={onEdit}
                  onStyleEdit={onStyleEdit}
                  typographyRole="body"
                  className={t.body.className}
                  style={t.body.style}
                  as="span"
                />
              </span>
            ) : (
              <a href={content.linkedinUrl} className={footerLinkClass()} target="_blank" rel="noreferrer">
                <LinkIcon />
                {content.linkedinLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
