import type { CSSProperties } from 'react'
import type { TypographyRole, TypographyRoleStyle } from '@lp-studio/types'
import { resolveColorHex, typographyPresentation } from '@lp-studio/tokens'

export function typoProps(
  roleStyle: TypographyRoleStyle,
  role: TypographyRole,
  ...extraClasses: string[]
): { className: string; style: CSSProperties } {
  const presentation = typographyPresentation(roleStyle, role)
  const colorStyle = roleStyle.textColor ? { color: resolveColorHex(roleStyle.textColor) } : {}
  return {
    className: [...extraClasses, presentation.className].filter(Boolean).join(' '),
    style: { ...presentation.style, ...colorStyle },
  }
}