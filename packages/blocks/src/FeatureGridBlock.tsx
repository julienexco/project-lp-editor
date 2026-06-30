import type { BlockProps } from '@lp-studio/types'
import {
  bodyClass,
  containerClass,
  contentAlignClass,
  mutedClass,
  sectionSpacing,
  sectionTheme,
  sectionTitleClass,
  serviceCardClass,
} from '@lp-studio/tokens'

export function FeatureGridBlock({ content, style }: BlockProps<'featureGrid'>) {
  return (
    <section className={[sectionTheme(style), sectionSpacing(style), 'border-t border-[#1A3066]/5'].join(' ')}>
      <div className={containerClass()}>
        <div className={contentAlignClass(style.align)}>
          <h2 className={`max-w-2xl ${sectionTitleClass(style)}`}>{content.sectionTitle}</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <article key={item.title} className={serviceCardClass()}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E3F2FD] text-sm font-bold text-[#1A3066]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-xl font-bold text-[#1A3066] sm:text-2xl">{item.title}</h3>
              <p className={`mt-2 text-xs font-semibold uppercase tracking-wider ${mutedClass()}`}>
                {item.tagline}
              </p>
              <p className={`mt-4 flex-1 ${bodyClass(style)} ${mutedClass()}`}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
