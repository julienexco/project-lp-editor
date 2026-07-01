export type EditorPanelVariant = 'light' | 'dark'

/** Palette sombre adoucie — charcoal élégant, moins agressif que le noir pur */
export const editorPanel = {
  shell: 'bg-[#1a1a1f] text-zinc-300',
  header: 'border-b border-white/[0.08] bg-[#1a1a1f]',
  headerLabel: 'text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500',
  headerButton: 'rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-100',
  empty: 'p-4 text-sm leading-relaxed text-zinc-500',
  expandButton:
    'absolute left-0 top-1/2 z-20 flex -translate-y-1/2 items-center gap-1 rounded-r-xl border border-l-0 border-white/10 bg-[#25252b] px-2.5 py-3 text-xs font-medium text-zinc-200 shadow-lg shadow-black/20 transition hover:bg-[#2d2d34]',
  section: 'border-b border-white/[0.06]',
  sectionButton:
    'group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.03]',
  sectionTitle:
    'text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 transition group-hover:text-zinc-300',
  sectionToggle:
    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#25252b] text-sm font-medium leading-none text-zinc-400 transition group-hover:border-white/15 group-hover:text-zinc-200',
  sectionBody: 'border-t border-white/[0.05] bg-[#15151a]/50',
  label: 'text-sm font-medium text-zinc-300',
  labelMuted: 'text-xs text-zinc-500',
  input:
    'w-full rounded-lg border border-white/[0.1] bg-[#242429] px-2.5 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition focus:border-[#E63946]/40 focus:outline-none focus:ring-1 focus:ring-[#E63946]/25',
  card: 'rounded-xl border border-white/[0.08] bg-[#222228]/70 p-3',
  chipActive: 'border-[#E63946]/60 bg-[#E63946]/12 text-zinc-100 ring-1 ring-[#E63946]/25',
  chip: 'border-white/10 bg-[#242429] text-zinc-400 hover:border-white/20 hover:text-zinc-200',
  blockActive:
    'border-[#E63946]/60 bg-[#E63946]/10 text-zinc-100 shadow-sm shadow-[#E63946]/10 ring-1 ring-[#E63946]/25',
  block: 'border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:border-white/15 hover:bg-white/[0.05]',
} as const

export function panelLabel(variant: EditorPanelVariant = 'light') {
  return variant === 'dark' ? editorPanel.label : 'text-sm font-medium text-[#1A3066]'
}

export function panelInput(variant: EditorPanelVariant = 'light') {
  return variant === 'dark' ? editorPanel.input : 'w-full rounded border px-2 py-1'
}

export function panelChip(active: boolean, variant: EditorPanelVariant = 'light') {
  const base = 'rounded-lg border px-3 py-1 text-xs capitalize transition'
  if (variant === 'dark') {
    return [base, active ? editorPanel.chipActive : editorPanel.chip].join(' ')
  }
  return [base, active ? 'border-[#E63946] bg-[#E3F2FD]' : ''].join(' ')
}
