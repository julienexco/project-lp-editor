import type { BlockInstance, CtaContent, FeatureGridContent, FooterContent, HeroContent } from '@lp-studio/types'
import { CTABlock } from './CTABlock'
import { FeatureGridBlock } from './FeatureGridBlock'
import { FooterBlock } from './FooterBlock'
import { HeroBlock } from './HeroBlock'

type BlockRendererProps = {
  blocks: BlockInstance[]
  selectedId?: string | null
  onSelect?: (id: string) => void
}

export function BlockRenderer({ blocks, selectedId, onSelect }: BlockRendererProps) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-full w-full bg-white">
      {sorted.map((block) => {
        const isSelected = selectedId === block.id
        const wrapperClass = [
          'relative transition',
          onSelect ? 'cursor-pointer hover:ring-2 hover:ring-inset hover:ring-[#E63946]/30' : '',
          isSelected ? 'ring-2 ring-inset ring-[#E63946]' : '',
        ]
          .filter(Boolean)
          .join(' ')

        const inner = (() => {
          switch (block.type) {
            case 'hero':
              return <HeroBlock content={block.content as HeroContent} style={block.style} />
            case 'featureGrid':
              return <FeatureGridBlock content={block.content as FeatureGridContent} style={block.style} />
            case 'cta':
              return <CTABlock content={block.content as CtaContent} style={block.style} />
            case 'footer':
              return <FooterBlock content={block.content as FooterContent} style={block.style} />
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
