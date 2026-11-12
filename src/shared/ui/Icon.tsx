import type { ComponentProps, ReactElement } from 'react'

// The 5 icons of the final design (object "I" in docs/design/diseno-final.html),
// drawn on a 16×16 grid with the current text color
const ICONS = {
  check: <path d="M3 8.5l3.2 3L13 4.5" strokeWidth={2.2} strokeLinejoin="round" />,
  cross: <path d="M4 4l8 8M12 4l-8 8" strokeWidth={2.2} />,
  dash: <path d="M4 8h8" strokeWidth={2.2} />,
  seal: (
    <g strokeWidth={1.8} strokeLinejoin="round">
      <path d="M8 1.5l1.7 1.3 2.1-.2.6 2 1.8 1.1-.7 2 .7 2-1.8 1.1-.6 2-2.1-.2L8 14.5l-1.7-1.3-2.1.2-.6-2-1.8-1.1.7-2-.7-2 1.8-1.1.6-2 2.1.2z" />
      <path d="M5.6 8.2l1.6 1.5 3.2-3.2" />
    </g>
  ),
  circle: <circle cx="8" cy="8" r="6" strokeWidth={1.8} strokeDasharray="2.4 2" />,
} satisfies Record<string, ReactElement>

export type IconName = keyof typeof ICONS

type IconProps = Omit<ComponentProps<'svg'>, 'children'> & {
  name: IconName
  size?: 14 | 16 // the design's two sizes: 14 px in chips, 16 px in lists
}

// Decorative by default: the word next to it carries the meaning (pass aria-hidden={false} to change it)
export function Icon({ name, size = 16, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      {ICONS[name]}
    </svg>
  )
}
