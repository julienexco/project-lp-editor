export function HeroGridPattern() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="lp-hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#1A3066" strokeOpacity="0.05" />
        </pattern>
        <linearGradient id="lp-hero-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3F2FD" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#lp-hero-grid)" />
      <rect width="100%" height="100%" fill="url(#lp-hero-fade)" />
    </svg>
  )
}

export function AccentBar() {
  return (
    <span
      aria-hidden
      className="inline-block h-1 w-12 rounded-full bg-gradient-to-r from-[#E63946] via-[#E63946]/80 to-[#1A3066]/30"
    />
  )
}

export function CtaArrowIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ServiceIcon({ variant }: { variant: 'coaching' | 'team' | 'pilot' }) {
  const paths = {
    coaching: (
      <path
        d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    ),
    team: (
      <>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
        <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.75" />
        <path d="M14 19c.3-2 1.8-3.5 4-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </>
    ),
    pilot: (
      <>
        <path d="M4 14l4-1.5 9-9 2.5 2.5-9 9L4 14z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M13 5l2.5 2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </>
    ),
  }

  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
      {paths[variant]}
    </svg>
  )
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
