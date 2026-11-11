import type { ComponentProps } from 'react'

type LogoProps = ComponentProps<'span'>

// Team symbol (star, arc and dot) and the "Pathfinders42" wordmark, without the NASA insignia.
// Visual only: the app header wraps it in the home link with its translated aria-label (#13).
export function Logo({ className = '', ...props }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} {...props}>
      <svg viewBox="0 0 40 32" aria-hidden="true" className="h-7 w-8.5 shrink-0">
        <path
          d="M3 24 A18 17 0 0 1 37 24"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="stroke-accent"
        />
        <circle cx="32.5" cy="12.5" r="2.4" className="fill-accent" />
        <path d="M20 2 L22 14 L31 16 L22 18 L20 30 L18 18 L9 16 L18 14 Z" fill="currentColor" />
      </svg>
      <span className="font-display text-logo font-extrabold tracking-display">
        Pathfinders<span className="text-accent">42</span>
      </span>
    </span>
  )
}
