import type { BlockProps } from '@lp-studio/types'
import { containerClass, footerLinkClass, sectionSpacing, sectionTheme } from '@lp-studio/tokens'
import { BrandLogo } from './BrandLogo'
import { LinkIcon, MailIcon } from './decorations'
import { EditableText } from './EditableText'

export function FooterBlock({ content, style, editable, onEdit }: BlockProps<'footer'>) {
  return (
    <footer className={[sectionTheme(style), sectionSpacing(style), 'relative border-t border-white/10'].join(' ')}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E63946] via-[#E63946]/50 to-transparent" />
      <div className={containerClass()}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-12">
          <div className="space-y-4">
            {content.showLogo ? (
              <BrandLogo alt={content.brandName} variant="footer" />
            ) : (
              <EditableText
                value={content.brandName}
                field="brandName"
                editable={editable}
                onEdit={onEdit}
                className="text-lg font-bold"
                as="p"
              />
            )}
            <EditableText
              value={content.copyright}
              field="copyright"
              editable={editable}
              onEdit={onEdit}
              className="max-w-md text-sm leading-relaxed opacity-75"
              as="p"
            />
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {editable ? (
              <span className={footerLinkClass()}>
                <MailIcon />
                <EditableText
                  value={content.email}
                  field="email"
                  editable={editable}
                  onEdit={onEdit}
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
