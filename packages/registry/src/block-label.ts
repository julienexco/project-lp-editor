import type { BlockInstance, BlockType } from '@lp-studio/types'
import type { blockRegistry } from './block-registry'

export function getBlockLabel(
  block: Pick<BlockInstance, 'type' | 'label'>,
  registry: typeof blockRegistry,
): string {
  const trimmed = block.label?.trim()
  if (trimmed) return trimmed
  return registry[block.type as BlockType]?.label ?? block.type
}
