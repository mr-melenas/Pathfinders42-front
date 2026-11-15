import { useTranslation } from 'react-i18next'
import { BODY_LABEL_KEYS } from '@/shared/i18n/labels'
import { formatCoordinate } from '@/shared/lib/format'
import { toSouthPolar, type MapSite } from '@/shared/lib/mapProjection'
import { MapFrame } from '@/shared/ui/MapFrame'
import { SiteMarker } from '@/shared/ui/SiteMarker'

type SouthPoleMapProps = {
  sites: MapSite[] // Moon sites; only those south of 80° S are drawn
  selectedId?: string // the site of the current page, highlighted
  className?: string // shape of the frame: square in Explore, 2:1 in the site detail
}

// Diagram of the Moon's south pole, where the Artemis sites are (they do not fit well on the global map)
export function SouthPoleMap({ sites, selectedId, className = 'aspect-square' }: SouthPoleMapProps) {
  const { t, i18n } = useTranslation()
  const south = t('coordinates.south')

  return (
    <MapFrame
      cuerpo="luna"
      label={t('bodyMap.southPole', { body: t(BODY_LABEL_KEYS.luna) })}
      caption={t('bodyMap.polarCaption')}
      className={className}
    >
      {/* The diagram is always a square, centred in the frame whatever its shape */}
      <div className="relative mx-auto aspect-square h-full">
        {/* viewBox of 100: the circle of radius 50 is the 80° S edge and the one of 25 is 85° S */}
        <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 size-full">
          <circle cx="50" cy="50" r="50" className="fill-surface" />
          <g className="fill-none stroke-border" strokeWidth="0.4">
            <circle cx="50" cy="50" r="25" strokeDasharray="1.5 2" />
            <path d="M50 0v100M0 50h100" strokeDasharray="1 2.5" />
          </g>
          <g className="fill-muted font-mono" fontSize="3.5">
            <text x="51.5" y="5">{`${formatCoordinate(80, i18n.language)} ${south}`}</text>
            <text x="51.5" y="29">{`${formatCoordinate(85, i18n.language)} ${south}`}</text>
          </g>
        </svg>
        <div aria-hidden="true" className="absolute inset-0">
          {sites.map(({ id, nombre, tipo, lat, lon }) => {
            const point = lat === null || lon === null ? null : toSouthPolar(lon, lat)
            return (
              point && (
                <SiteMarker key={id} to={`/luna/${id}`} name={nombre} tipo={tipo} point={point} selected={id === selectedId} />
              )
            )
          })}
        </div>
      </div>
    </MapFrame>
  )
}
