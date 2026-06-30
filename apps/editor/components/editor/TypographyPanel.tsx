'use client'

import type { BlockStyle, BlockType, FontFamilyToken, TypographyRole, TypographyRoleStyle, WeightToken } from '@lp-studio/types'
import {
  blockTypographyRoles,
  clampSizePx,
  resolveTypographyRole,
  typographyRoleLabels,
} from '@lp-studio/registry'
import { fontFamilyLabels, fontFamilyTokens, weightLabels } from '@lp-studio/tokens'

type TypographyPanelProps = {
  blockType: BlockType
  style: BlockStyle
  onRoleChange: (role: TypographyRole, partial: Partial<TypographyRoleStyle>) => void
}

const weightOptions: WeightToken[] = ['normal', 'medium', 'bold']

export function TypographyPanel({ blockType, style, onRoleChange }: TypographyPanelProps) {
  const roles = blockTypographyRoles[blockType]

  return (
    <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5C6B8A]">Typographie</p>

      <div className="space-y-3">
        {roles.map((role) => {
          const resolved = resolveTypographyRole(blockType, style, role)
          return (
            <div key={role} className="rounded-lg border border-gray-100 bg-[#f8fafc] p-3">
              <p className="mb-2 text-sm font-medium text-[#1A3066]">{typographyRoleLabels[role]}</p>

              <label className="mb-2 block text-xs">
                <span className="mb-1 block text-[#5C6B8A]">Police</span>
                <select
                  className="w-full rounded border px-2 py-1.5 text-sm"
                  value={resolved.family}
                  onChange={(e) => onRoleChange(role, { family: e.target.value as FontFamilyToken })}
                >
                  {fontFamilyTokens.map((family) => (
                    <option key={family} value={family}>
                      {fontFamilyLabels[family]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs">
                  <span className="mb-1 block text-[#5C6B8A]">Taille (px)</span>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    step={1}
                    className="w-full rounded border px-2 py-1.5 text-sm"
                    value={resolved.sizePx}
                    onChange={(e) => onRoleChange(role, { sizePx: clampSizePx(Number(e.target.value) || resolved.sizePx) })}
                  />
                </label>
                <label className="block text-xs">
                  <span className="mb-1 block text-[#5C6B8A]">Graisse</span>
                  <select
                    className="w-full rounded border px-2 py-1.5 text-sm"
                    value={resolved.weight}
                    onChange={(e) => onRoleChange(role, { weight: e.target.value as WeightToken })}
                  >
                    {weightOptions.map((weight) => (
                      <option key={weight} value={weight}>
                        {weightLabels[weight]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
