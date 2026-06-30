import type { BlockProps } from '@lp-studio/types'
import { containerClass, sectionSpacing, sectionTheme } from '@lp-studio/tokens'

const LOGO_PATH = '/brand/logo-upscaly-consulting.png'

export function FooterBlock({ content, style }: BlockProps<'footer'>) {
  return (
    <footer className={[sectionTheme(style), sectionSpacing(style), 'border-t border-white/10'].join(' ')}>
      <div className={containerClass()}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-4">
            {content.showLogo ? (
              <img
                src={LOGO_PATH}
                alt={content.brandName}
                className="h-10 w-auto brightness-0 invert sm:h-11"
              />
            ) : (
              <p className="text-lg font-bold">{content.brandName}</p>
            )}
            <p className="max-w-md text-sm leading-relaxed opacity-80">{content.copyright}</p>
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
