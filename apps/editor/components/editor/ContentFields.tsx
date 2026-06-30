import type { BlockInstance, BlockType } from '@lp-studio/types'
import type { BlockDefinition } from '@lp-studio/registry'

type ContentFieldsProps = {
  block: BlockInstance
  schema: BlockDefinition['contentSchema']
  onChange: (field: string, value: unknown) => void
}

export function ContentFields({ block, schema, onChange }: ContentFieldsProps) {
  const content = block.content as Record<string, unknown>

  return (
    <div className="space-y-3">
      {Object.entries(schema).map(([key, field]) => {
        if (field.type === 'stats') {
          const stats = (content.stats as { value: string; label: string }[]) ?? []
          return (
            <div key={key} className="space-y-2">
              <p className="text-sm font-medium text-[#1A3066]">{field.label}</p>
              {stats.map((stat, i) => (
                <div key={stat.label} className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded border px-2 py-1 text-sm"
                    value={stat.value}
                    onChange={(e) => {
                      const next = [...stats]
                      next[i] = { ...stat, value: e.target.value }
                      onChange('stats', next)
                    }}
                    placeholder="Valeur"
                  />
                  <input
                    className="rounded border px-2 py-1 text-sm"
                    value={stat.label}
                    onChange={(e) => {
                      const next = [...stats]
                      next[i] = { ...stat, label: e.target.value }
                      onChange('stats', next)
                    }}
                    placeholder="Label"
                  />
                </div>
              ))}
            </div>
          )
        }

        if (field.type === 'featureItems') {
          const items = (content.items as { title: string; tagline: string; description: string }[]) ?? []
          return (
            <div key={key} className="space-y-3">
              <p className="text-sm font-medium text-[#1A3066]">{field.label}</p>
              {items.map((item, i) => (
                <div key={item.title} className="space-y-1 rounded border p-2">
                  <input
                    className="w-full rounded border px-2 py-1 text-sm font-semibold"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...items]
                      next[i] = { ...item, title: e.target.value }
                      onChange('items', next)
                    }}
                  />
                  <input
                    className="w-full rounded border px-2 py-1 text-xs"
                    value={item.tagline}
                    onChange={(e) => {
                      const next = [...items]
                      next[i] = { ...item, tagline: e.target.value }
                      onChange('items', next)
                    }}
                  />
                  <textarea
                    className="w-full rounded border px-2 py-1 text-sm"
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...items]
                      next[i] = { ...item, description: e.target.value }
                      onChange('items', next)
                    }}
                  />
                </div>
              ))}
            </div>
          )
        }

        if (field.type === 'boolean') {
          return (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(content[key])}
                onChange={(e) => onChange(key, e.target.checked)}
              />
              {field.label}
            </label>
          )
        }

        const isLong = key === 'subtitle' || key === 'description'
        return (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium text-[#1A3066]">{field.label}</span>
            {isLong ? (
              <textarea
                className="w-full rounded border px-2 py-1"
                rows={3}
                value={String(content[key] ?? '')}
                onChange={(e) => onChange(key, e.target.value)}
              />
            ) : (
              <input
                className="w-full rounded border px-2 py-1"
                value={String(content[key] ?? '')}
                onChange={(e) => onChange(key, e.target.value)}
              />
            )}
          </label>
        )
      })}
    </div>
  )
}
