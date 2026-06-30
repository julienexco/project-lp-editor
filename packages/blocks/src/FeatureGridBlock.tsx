import type { BlockProps } from '@lp-studio/types'
import {
  containerClass,
  featuredServiceCardClass,
  mutedClass,
  sectionSpacing,
  sectionTheme,
  sectionTitleClass,
  serviceCardClass,
} from '@lp-studio/tokens'
import { AccentBar } from './decorations'
import { EditableText } from './EditableText'

export function FeatureGridBlock({ content, style, editable, onEdit }: BlockProps<'featureGrid'>) {
  const centered = style.align === 'center'
  const featuredIndex = Math.min(1, content.items.length - 1)

  return (
    <section className={[sectionTheme(style), sectionSpacing(style), 'relative'].join(' ')}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1A3066]/10 to-transparent" />
      <div className={containerClass()}>
        <div
          className={[
            'mb-10 flex flex-col gap-4 sm:mb-14',
            centered ? 'mx-auto max-w-2xl items-center text-center' : 'max-w-2xl',
          ].join(' ')}
        >
          <AccentBar />
          <EditableText
            value={content.sectionTitle}
            field="sectionTitle"
            editable={editable}
            onEdit={onEdit}
            className={sectionTitleClass(style)}
            as="h2"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <article
              key={`item-${index}`}
              className={index === featuredIndex ? featuredServiceCardClass() : serviceCardClass()}
            >
              <span
                className={[
                  'inline-flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold',
                  index === featuredIndex
                    ? 'bg-[#E63946] text-white shadow-md shadow-[#E63946]/25'
                    : 'bg-[#E3F2FD] text-[#1A3066]',
                ].join(' ')}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <EditableText
                value={item.title}
                field={`items.${index}.title`}
                editable={editable}
                onEdit={onEdit}
                className="mt-5 text-lg font-bold text-[#1A3066] sm:text-xl"
                as="h3"
              />
              <EditableText
                value={item.tagline}
                field={`items.${index}.tagline`}
                editable={editable}
                onEdit={onEdit}
                className={`mt-2 text-xs font-semibold uppercase tracking-wider ${mutedClass()}`}
                as="p"
              />
              <EditableText
                value={item.description}
                field={`items.${index}.description`}
                editable={editable}
                onEdit={onEdit}
                multiline
                className={`mt-4 flex-1 text-sm leading-relaxed sm:text-base ${mutedClass()}`}
                as="p"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
