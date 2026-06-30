import type { BlockProps } from '@lp-studio/types'
import {
  accentButtonClass,
  bodyClass,
  containerClass,
  contentAlignClass,
  headingClass,
  sectionSpacing,
  sectionTheme,
} from '@lp-studio/tokens'

export function CTABlock({ content, style }: BlockProps<'cta'>) {
  return (
    <section id="contact" className={[sectionTheme(style), sectionSpacing(style)].join(' ')}>
      <div className={containerClass()}>
        <div
          className={[
            contentAlignClass(style.align),
            'rounded-3xl border border-white/10 px-6 py-10 sm:px-10 sm:py-14 lg:px-16',
            style.color.bg === 'navy' ? 'bg-[#1A3066]/95' : 'bg-white shadow-xl shadow-[#1A3066]/10',
          ].join(' ')}
        >
          <h2 className={`max-w-2xl ${headingClass(style)}`}>{content.title}</h2>
          <p className={`mt-4 max-w-2xl sm:mt-5 ${bodyClass(style)} opacity-90`}>{content.description}</p>
          <a href={content.buttonHref} className={`mt-8 sm:mt-10 ${accentButtonClass(style.align)}`}>
            {content.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
