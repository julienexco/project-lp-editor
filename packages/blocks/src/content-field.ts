export function applyContentField(
  content: Record<string, unknown>,
  field: string,
  value: string,
): Record<string, unknown> {
  const segments = field.split('.')
  if (segments.length === 1) {
    return { ...content, [field]: value }
  }

  const [root, indexStr, leaf] = segments
  const index = Number(indexStr)
  const list = [...(content[root] as Record<string, string>[])]
  list[index] = { ...list[index], [leaf]: value }
  return { ...content, [root]: list }
}
