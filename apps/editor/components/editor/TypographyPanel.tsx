'use client'

import type { BlockStyle, BlockType, TypographyRole, TypographyRoleStyle } from '@lp-studio/types'
import { blockTypographyRoles, typographyRoleLabels } from '@lp-studio/registry'
import { TypographyRoleControls } from './TypographyRoleControls'

type TypographyPanelProps = {
  blockType: BlockType
  style: BlockStyle
  customColors: readonly string[]
  onRoleChange: (role: TypographyRole, partial: Partial<TypographyRoleStyle>) => void
}

export function TypographyPanel({ blockType, style, customColors, onRoleChange }: TypographyPanelProps) {
  const roles = blockTypographyRoles[blockType]

  return (
    <div className="space-y-3 px-4 py-4">
      {roles.map((role) => (
        <div key={role} className="rounded-lg border border-gray-100 bg-[#f8fafc] p-3">
          <p className="mb-2 text-sm font-medium text-[#1A3066]">{typographyRoleLabels[role]}</p>
          <TypographyRoleControls
            blockType={blockType}
            role={role}
            style={style}
            customColors={customColors}
            onChange={(partial) => onRoleChange(role, partial)}
          />
        </div>
      ))}
    </div>
  )
}
