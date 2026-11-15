import type { ReactNode } from 'react'
import type { Body } from '@/shared/i18n/labels'

// Marker colour of each body: Mars has no colour of its own yet (F4.8), so it uses the text colour
const BODY_COLOR: Record<Body, string> = { luna: 'text-body-moon', marte: 'text-foreground' }

type MapFrameProps = {
  cuerpo: Body
  label: string // top-left tag, e.g. «Luna · polo sur»
  caption: string // what the map shows and where it comes from
  className?: string // the map's shape, e.g. "aspect-2/1"
  children: ReactNode
}

// Common frame of the maps (sistema-visual §6.3): dark box while the image loads, tag and caption
export function MapFrame({ cuerpo, label, caption, className = '', children }: MapFrameProps) {
  return (
    <figure className="flex flex-col gap-1.5">
      <div className={`relative overflow-hidden rounded-card bg-map ${BODY_COLOR[cuerpo]} ${className}`}>
        {children}
        <span className="absolute top-2 left-2 flex items-center gap-1.5 rounded-chip bg-map px-2 py-0.5 text-caption">
          <span aria-hidden="true" className="size-2 rounded-full bg-current" />
          <span className="text-foreground">{label}</span>
        </span>
      </div>
      <figcaption className="text-caption text-muted">{caption}</figcaption>
    </figure>
  )
}
