// Shared classes of the landing: one place, so every button and section looks the same

// Main action (accent: actions, never a verdict)
export const PRIMARY_BUTTON =
  'inline-flex items-center gap-2 rounded-chip bg-accent px-4 py-2.5 text-compact font-semibold text-background hover:bg-foreground'

// Secondary action, on dark backgrounds
export const SECONDARY_BUTTON =
  'inline-flex items-center gap-2 rounded-chip border border-foreground/40 px-4 py-2.5 text-compact font-semibold text-foreground hover:bg-surface-2'

// Width and vertical rhythm of every section
export const SECTION = 'mx-auto flex w-full max-w-content flex-col gap-10 px-4 py-16 md2:py-24'

// Framed images (rounded, thin border, dark while they load)
export const FRAME = 'overflow-hidden rounded-frame border border-border bg-map'
