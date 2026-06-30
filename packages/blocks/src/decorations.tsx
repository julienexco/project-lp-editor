export function HeroGridPattern() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="lp-hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="#1A3066" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lp-hero-grid)" />
    </svg>
  )
}

export function AccentBar() {
  return <span aria-hidden className="inline-block h-1 w-10 rounded-full bg-[#E63946]" />
}

export function MailIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M4 6h16v12H4V6zm0 0l8 7 8-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LinkIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M10 14a5 5 0 007.07 0l1.41-1.41a5 5 0 00-7.07-7.07L10 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14 10a5 5 0 00-7.07 0L5.52 11.41a5 5 0 007.07 7.07L14 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}
