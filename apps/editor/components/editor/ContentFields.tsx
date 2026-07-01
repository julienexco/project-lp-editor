import type { BlockInstance, BlockType } from '@lp-studio/types'
import type { BlockDefinition } from '@lp-studio/registry'
import { editorPanel, type EditorPanelVariant } from './editor-panel-theme'

type ContentFieldsProps = {
  block: BlockInstance
  schema: BlockDefinition['contentSchema']
  onChange: (field: string, value: unknown) => void
  variant?: EditorPanelVariant
}

export function ContentFields({ block, schema, onChange, variant = 'dark' }: ContentFieldsProps) {
  const content = block.content as Record<string, unknown>
  const labelClass = variant === 'dark' ? editorPanel.label : 'mb-1 block font-medium text-[#1A3066]'
  const inputClass = variant === 'dark' ? editorPanel.input : 'w-full rounded border px-2 py-1'
  const cardClass =
    variant === 'dark' ? editorPanel.card : 'space-y-1 rounded border p-2'
  const checkboxClass = variant === 'dark' ? 'text-sm text-zinc-300' : 'flex items-center gap-2 text-sm'

  return (
    <div className="space-y-3">
      {Object.entries(schema).map(([key, field]) => {
        if (field.type === 'stats') {
          const stats = (content.stats as { value: string; label: string }[]) ?? []
          return (
            <div key={key} className="space-y-2">
              <p className={variant === 'dark' ? editorPanel.label : 'text-sm font-medium text-[#1A3066]'}>{field.label}</p>
              {stats.map((stat, i) => (
                <div key={stat.label} className="grid grid-cols-2 gap-2">
                  <input
                    className={inputClass}
                    value={stat.value}
                    onChange={(e) => {
                      const next = [...stats]
                      next[i] = { ...stat, value: e.target.value }
                      onChange('stats', next)
                    }}
                    placeholder="Valeur"
                  />
                  <input
                    className={inputClass}
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
              <p className={variant === 'dark' ? editorPanel.label : 'text-sm font-medium text-[#1A3066]'}>{field.label}</p>
              {items.map((item, i) => (
                <div key={item.title} className={cardClass}>
                  <input
                    className={`${inputClass} font-semibold`}
                    value={item.title}
                    onChange={(e) => {
                      const next = [...items]
                      next[i] = { ...item, title: e.target.value }
                      onChange('items', next)
                    }}
                  />
                  <input
                    className={`${inputClass} text-xs`}
                    value={item.tagline}
                    onChange={(e) => {
                      const next = [...items]
                      next[i] = { ...item, tagline: e.target.value }
                      onChange('items', next)
                    }}
                  />
                  <textarea
                    className={inputClass}
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
            <label key={key} className={`flex items-center gap-2 ${checkboxClass}`}>
              <input
                type="checkbox"
                checked={Boolean(content[key])}
                onChange={(e) => onChange(key, e.target.checked)}
                className="accent-[#E63946]"
              />
              {field.label}
            </label>
          )
        }

        const isLong = key === 'subtitle' || key === 'description'
        return (
          <label key={key} className="block text-sm">
            <span className={labelClass}>{field.label}</span>
            {isLong ? (
              <textarea
                className={inputClass}
                rows={3}
                value={String(content[key] ?? '')}
                onChange={(e) => onChange(key, e.target.value)}
              />
            ) : (
              <input
                className={inputClass}
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
