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
    <div className="p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5C6B8A]">Blocs</p>
      <ul className="space-y-2">
        {sorted.map((block) => {
          const label = registry[block.type as BlockType]?.label ?? block.type
          const active = block.id === selectedId
          return (
            <li key={block.id}>
              <button
                type="button"
                onClick={() => onSelect(block.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                  active
                    ? 'border-[#E63946] bg-[#E3F2FD] text-[#1A3066]'
                    : 'border-gray-200 hover:border-[#1A3066]/30'
                }`}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
