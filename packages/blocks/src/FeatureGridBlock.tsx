import type { BlockProps } from '@lp-studio/types'
import {
  containerClass,
  mutedClass,
  sectionSpacing,
  sectionTheme,
  sectionTitleClass,
  serviceCardClass,
} from '@lp-studio/tokens'

export function FeatureGridBlock({ content, style }: BlockProps<'featureGrid'>) {
  const centered = style.align === 'center'

  return (
    <section className={[sectionTheme(style), sectionSpacing(style), 'border-t border-[#1A3066]/5'].join(' ')}>
      <div className={containerClass()}>
        <div className={`mb-10 sm:mb-14 ${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
          <h2 className={sectionTitleClass(style)}>{content.sectionTitle}</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <article key={item.title} className={serviceCardClass()}>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#E3F2FD] text-xs font-bold text-[#1A3066]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-lg font-bold text-[#1A3066] sm:text-xl">{item.title}</h3>
              <p className={`mt-2 text-xs font-semibold uppercase tracking-wider ${mutedClass()}`}>{item.tagline}</p>
              <p className={`mt-4 flex-1 text-sm leading-relaxed sm:text-base ${mutedClass()}`}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
