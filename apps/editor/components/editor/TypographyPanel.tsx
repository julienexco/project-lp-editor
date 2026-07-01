'use client'

import type { BlockStyle, BlockType, TypographyRole, TypographyRoleStyle } from '@lp-studio/types'
import { blockTypographyRoles, typographyRoleLabels } from '@lp-studio/registry'
import { editorPanel, type EditorPanelVariant } from './editor-panel-theme'
import { TypographyRoleControls } from './TypographyRoleControls'

type TypographyPanelProps = {
  blockType: BlockType
  style: BlockStyle
  customColors: readonly string[]
  onRoleChange: (role: TypographyRole, partial: Partial<TypographyRoleStyle>) => void
  variant?: EditorPanelVariant
}

export function TypographyPanel({
  blockType,
  style,
  customColors,
  onRoleChange,
  variant = 'dark',
}: TypographyPanelProps) {
  const roles = blockTypographyRoles[blockType]
  const cardClass = variant === 'dark' ? editorPanel.card : 'rounded-lg border border-gray-100 bg-[#f8fafc] p-3'
  const titleClass = variant === 'dark' ? editorPanel.label : 'mb-2 text-sm font-medium text-[#1A3066]'

  return (
    <div className="space-y-3 px-4 py-4">
      {roles.map((role) => (
        <div key={role} className={cardClass}>
          <p className={`mb-2 ${titleClass}`}>{typographyRoleLabels[role]}</p>
          <TypographyRoleControls
            blockType={blockType}
            role={role}
            style={style}
            customColors={customColors}
            onChange={(partial) => onRoleChange(role, partial)}
            variant={variant}
          />
        </div>
      ))}
    </div>
  )
}
