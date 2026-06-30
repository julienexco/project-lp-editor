import type { BlockInstance, BlockType } from '@lp-studio/types'
import type { blockRegistry } from '@lp-studio/registry'

type BlockListProps = {
  blocks: BlockInstance[]
  selectedId: string | null
  onSelect: (id: string) => void
  registry: typeof blockRegistry
}

export function BlockList({ blocks, selectedId, onSelect, registry }: BlockListProps) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order)

  return (
    <ul className="space-y-2 px-4 py-4">
      {sorted.map((block) => {
        const label = registry[block.type as BlockType]?.label ?? block.type
        const active = block.id === selectedId
        return (
          <li key={block.id}>
            <button
              type="button"
              onClick={() => onSelect(block.id)}
              className={[
                'w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition',
                active
                  ? 'border-[#E63946] bg-[#E3F2FD] text-[#1A3066] shadow-sm ring-1 ring-[#E63946]/30'
                  : 'border-gray-200 text-[#1A3066]/80 hover:border-[#1A3066]/30 hover:bg-[#f8fafc]',
              ].join(' ')}
            >
              {label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
