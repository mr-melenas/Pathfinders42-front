import { Link } from 'react-router'
import type { MapPoint } from '@/features/explore/components/mapProjection'
import { MarkerShape } from '@/features/explore/components/MarkerShape'
import { shapeOf } from '@/features/explore/components/siteShapes'

type SiteMarkerProps = {
  to: string // URL of the site's detail
  name: string // shown on mouse hover
  tipo: string // API value
  point: MapPoint // position as fractions of the map (mapProjection.ts)
}

// One site on a map. Mouse only: keyboard and screen reader users get the same links in the list below the map
export function SiteMarker({ to, name, tipo, point }: SiteMarkerProps) {
  return (
    <Link
      to={to}
      title={name}
      tabIndex={-1}
      // The position is data, not a design value, so it goes in style and not in a class
      style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
      className="absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center hover:text-accent"
    >
      <MarkerShape shape={shapeOf(tipo)} />
    </Link>
  )
}
