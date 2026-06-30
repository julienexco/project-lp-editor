'use client'

import { useEffect, useRef } from 'react'
import type { BlockInstance, BlockType, CtaContent, FeatureGridContent, FooterContent, HeroContent } from '@lp-studio/types'
import { blockRegistry } from '@lp-studio/registry'
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
  const prevSelectedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!selectedId || selectedId === prevSelectedRef.current) return
    prevSelectedRef.current = selectedId
    const el = document.getElementById(`block-preview-${selectedId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [selectedId])

  return (
    <div className="@container min-h-full w-full bg-[#f8fafc] text-[#1A3066] antialiased [container-type:inline-size]">
      {sorted.map((block) => {
        const isSelected = selectedId === block.id
        const hasSelection = Boolean(selectedId && onSelect)
        const label = blockRegistry[block.type as BlockType]?.label ?? block.type

        const wrapperClass = [
          'relative transition-all duration-200',
          onSelect ? 'cursor-pointer' : '',
          isSelected
            ? 'z-10 shadow-[inset_0_0_0_3px_#E63946,0_0_0_4px_rgba(230,57,70,0.15)]'
            : hasSelection
              ? 'opacity-55 hover:opacity-80'
              : '',
          !isSelected && onSelect ? 'hover:shadow-[inset_0_0_0_2px_rgba(230,57,70,0.35)]' : '',
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
            id={`block-preview-${block.id}`}
            className={wrapperClass}
            onClick={() => onSelect(block.id)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(block.id)}
            role="button"
            tabIndex={0}
            aria-current={isSelected ? 'true' : undefined}
            aria-label={`Bloc ${label}`}
          >
            {isSelected ? (
              <div
                className="pointer-events-none absolute left-2 top-2 z-20 rounded-md bg-[#E63946] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg @sm:left-4 @sm:top-4 @sm:px-3 @sm:py-1.5 @sm:text-xs"
                aria-hidden
              >
                {label}
              </div>
            ) : null}
            {inner}
          </div>
        )
      })}
    </div>
  )
}
