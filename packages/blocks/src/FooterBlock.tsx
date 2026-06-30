import type { BlockProps } from '@lp-studio/types'
import { containerClass, sectionSpacing, sectionTheme } from '@lp-studio/tokens'
import { BrandLogo } from './BrandLogo'

export function FooterBlock({ content, style }: BlockProps<'footer'>) {
  return (
    <footer className={[sectionTheme(style), sectionSpacing(style), 'border-t border-white/10'].join(' ')}>
      <div className={containerClass()}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-12">
          <div className="space-y-4">
            {content.showLogo ? (
              <BrandLogo alt={content.brandName} variant="footer" />
            ) : (
              <p className="text-lg font-bold">{content.brandName}</p>
            )}
            <p className="max-w-sm text-sm leading-relaxed opacity-80">{content.copyright}</p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end sm:text-right">
            <a
              href={`mailto:${content.email}`}
              className="text-sm font-medium transition hover:text-[#E63946] sm:text-base"
            >
              {content.email}
            </a>
            <a
              href={content.linkedinUrl}
              className="text-sm font-medium transition hover:text-[#E63946] sm:text-base"
              target="_blank"
              rel="noreferrer"
            >
              {content.linkedinLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
