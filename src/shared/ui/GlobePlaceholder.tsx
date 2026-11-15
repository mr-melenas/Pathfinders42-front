import type { Body } from '@/shared/i18n/labels'
import { MapFrame } from '@/shared/ui/MapFrame'

type GlobePlaceholderProps = {
  cuerpo: Body | 'tierra'
  label: string
  caption: string
}

// Shown while MapLibre downloads: the globe's empty frame, same size, tag and caption, so nothing jumps.
// Kept apart from Globe.tsx: importing that file would download MapLibre too
export function GlobePlaceholder({ cuerpo, label, caption }: GlobePlaceholderProps) {
  return (
    <MapFrame cuerpo={cuerpo} label={label} caption={caption} className="aspect-2/1">
      {null}
    </MapFrame>
  )
}
