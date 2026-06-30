import type { BlockProps } from '@lp-studio/types'
import {
  accentButtonClass,
  bodyClass,
  containerClass,
  sectionSpacing,
  sectionTheme,
  sectionTitleClass,
} from '@lp-studio/tokens'

export function CTABlock({ content, style }: BlockProps<'cta'>) {
  const centered = style.align === 'center'

  return (
    <section id="contact" className={[sectionTheme(style), sectionSpacing(style)].join(' ')}>
      <div className={containerClass()}>
        <div
          className={[
            'rounded-2xl border border-white/10 px-6 py-10 sm:rounded-3xl sm:px-10 sm:py-14 lg:px-16',
            style.color.bg === 'navy' ? 'bg-[#152a57]' : 'bg-white shadow-xl shadow-[#1A3066]/10',
            centered ? 'text-center' : 'text-left',
          ].join(' ')}
        >
          <h2 className={`max-w-2xl ${sectionTitleClass(style)} ${centered ? 'mx-auto' : ''}`}>
            {content.title}
          </h2>
          <p
            className={`mt-4 max-w-2xl text-sm leading-relaxed opacity-90 sm:mt-5 sm:text-base ${bodyClass(style)} ${centered ? 'mx-auto' : ''}`}
          >
            {content.description}
          </p>
          <a
            href={content.buttonHref}
            className={`mt-8 inline-flex sm:mt-10 ${accentButtonClass()}`}
          >
            {content.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
