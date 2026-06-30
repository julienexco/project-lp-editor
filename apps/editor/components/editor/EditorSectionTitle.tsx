type EditorSectionTitleProps = {
  children: React.ReactNode
}

export function EditorSectionTitle({ children }: EditorSectionTitleProps) {
  return (
    <div className="border-b border-[#1A3066]/10 bg-[#E3F2FD]/40 px-4 py-3">
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1A3066]">{children}</h2>
    </div>
  )
}
