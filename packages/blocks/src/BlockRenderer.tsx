import type { BlockInstance, CtaContent, FeatureGridContent, FooterContent, HeroContent } from '@lp-studio/types'
import { CTABlock } from './CTABlock'
import { FeatureGridBlock } from './FeatureGridBlock'
import { FooterBlock } from './FooterBlock'
import { HeroBlock } from './HeroBlock'

type BlockRendererProps = {
  blocks: BlockInstance[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  onContentEdit?: (blockId: string, field: string, value: string) => void
}

export function BlockRenderer({ blocks, selectedId, onSelect, onContentEdit }: BlockRendererProps) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order)
  const editable = Boolean(onContentEdit)

  return (
    <div className="min-h-full w-full bg-[#f8fafc] text-[#1A3066] antialiased">
      {sorted.map((block) => {
        const isSelected = selectedId === block.id
        const wrapperClass = [
          'relative transition',
          onSelect ? 'cursor-pointer hover:ring-2 hover:ring-inset hover:ring-[#E63946]/30' : '',
          isSelected ? 'ring-2 ring-inset ring-[#E63946]' : '',
        ]
          .filter(Boolean)
          .join(' ')

        const editProps = {
          editable,
          onEdit: onContentEdit ? (field: string, value: string) => onContentEdit(block.id, field, value) : undefined,
        }

        const inner = (() => {
          switch (block.type) {
            case 'hero':
              return <HeroBlock content={block.content as HeroContent} style={block.style} {...editProps} />
            case 'featureGrid':
              return (
                <FeatureGridBlock content={block.content as FeatureGridContent} style={block.style} {...editProps} />
              )
            case 'cta':
              return <CTABlock content={block.content as CtaContent} style={block.style} {...editProps} />
            case 'footer':
              return <FooterBlock content={block.content as FooterContent} style={block.style} {...editProps} />
            default:
              return (
                <div className="bg-gray-200 p-8 text-center text-gray-600">
                  Bloc inconnu
                </div>
              )
          }
        })()

        if (!onSelect) {
          return <div key={block.id}>{inner}</div>
        }

        return (
          <div
            key={block.id}
            className={wrapperClass}
            onClick={() => onSelect(block.id)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(block.id)}
            role="button"
            tabIndex={0}
          >
            {inner}
          </div>
        )
      })}
    </div>
  )
}
