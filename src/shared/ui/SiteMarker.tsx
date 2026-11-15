import { Link } from 'react-router'
import type { MapPoint } from '@/shared/lib/mapProjection'
import { shapeOf } from '@/shared/lib/siteShapes'
import { MarkerShape } from '@/shared/ui/MarkerShape'

type SiteMarkerProps = {
  to: string // URL of the site's detail
  name: string // shown on mouse hover
  tipo: string // API value
  point: MapPoint // position as fractions of the map (mapProjection.ts)
  selected?: boolean // the site of the current page: accent colour and a pulse ring
}

// One site on a map. Mouse only: keyboard and screen reader users get the same links elsewhere on the page
export function SiteMarker({ to, name, tipo, point, selected = false }: SiteMarkerProps) {
  return (
    <Link
      to={to}
      title={name}
      tabIndex={-1}
      // The position is data, not a design value, so it goes in style and not in a class
      style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
      className={`absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center hover:text-accent ${
        selected ? 'z-10 text-accent' : ''
      }`}
    >
      {/* Pulse only when the person has not asked for reduced motion */}
      {selected && <span className="absolute inset-0 rounded-full border-2 border-accent motion-safe:animate-ping" />}
      <MarkerShape shape={shapeOf(tipo)} />
    </Link>
  )
}
