import { Link } from 'react-router'
import { isSiteType, type SiteType } from '@/shared/i18n/labels'
import type { MapPoint } from '@/features/explore/components/mapProjection'

type Shape = 'region' | 'landing' | 'cave' | 'unknown'

// The shape tells the type (sistema-visual §6.3, SiteMarker). Every known type is listed,
// so a new type in the translation files is a TypeScript error here until it gets a shape
const SHAPE_BY_TYPE: Record<SiteType, Shape> = {
  region_aterrizaje_artemis: 'region',
  exploration_zone: 'region',
  aterrizaje_tripulado: 'landing',
  aterrizaje_robotico: 'landing',
  aterrizaje_planificado: 'landing',
  cueva_luna: 'cave',
  cueva_marte: 'cave',
}

const SHAPE_CLASS: Record<Shape, string> = {
  region: 'size-3 border-2 border-current bg-current/18', // square with an 18 % fill
  landing: 'size-2.5 rotate-45 bg-current', // diamond
  cave: 'size-3 rounded-full border-2 border-current', // ring, with a dot inside
  unknown: 'size-2.5 rounded-full bg-current', // a type we do not know yet: a plain dot
}

type SiteMarkerProps = {
  to: string // URL of the site's detail
  name: string // shown on mouse hover
  tipo: string // API value
  point: MapPoint // position as fractions of the map (mapProjection.ts)
}

// One site on a map. Mouse only: keyboard and screen reader users get the same links in the list below the map
export function SiteMarker({ to, name, tipo, point }: SiteMarkerProps) {
  const shape = isSiteType(tipo) ? SHAPE_BY_TYPE[tipo] : 'unknown'

  return (
    <Link
      to={to}
      title={name}
      tabIndex={-1}
      // The position is data, not a design value, so it goes in style and not in a class
      style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
      className="absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center hover:text-accent"
    >
      {/* Dark ring so the marker stands out on light and dark parts of the image */}
      <span className={`flex items-center justify-center ring-1 ring-map ${SHAPE_CLASS[shape]}`}>
        {shape === 'cave' && <span className="size-1 rounded-full bg-current" />}
      </span>
    </Link>
  )
}
