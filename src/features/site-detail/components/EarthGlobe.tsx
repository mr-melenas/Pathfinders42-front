import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { labelMarkerElement } from '@/shared/lib/globeMarkers'
import { Globe, type GlobeImagery } from '@/shared/ui/Globe'

// Sentinel-2 cloudless 2016 by EOX: CC BY 4.0 (later years are non-commercial only). CORS checked on 15 nov
const EARTH_IMAGERY: GlobeImagery = {
  tiles: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg',
  maxzoom: 14,
}
const PAIR_ZOOM = 7 // close enough to see the place and still some of its surroundings

type EarthGlobeProps = {
  pairName: string | null // the best match's name; null when there is none
  position: { lat: number; lon: number } | null // the pair's "lat" / "lon" from the API; null when it does not say
}

// 3D Earth with satellite imagery: it turns to the pair and marks it. Loaded on demand (MapLibre is heavy)
export function EarthGlobe({ pairName, position }: EarthGlobeProps) {
  const { t } = useTranslation()
  const lat = position?.lat ?? null
  const lon = position?.lon ?? null

  const markers = useMemo(
    () =>
      lat !== null && lon !== null && pairName !== null
        ? [{ id: 'pair', lat, lon, anchor: 'bottom' as const, element: () => labelMarkerElement(pairName) }]
        : [],
    [lat, lon, pairName],
  )

  return (
    <Globe
      cuerpo="tierra"
      imagery={EARTH_IMAGERY}
      label={t('earthMap.label')}
      caption={t('earthGlobe.caption')}
      markers={markers}
      focus={lat !== null && lon !== null ? { lat, lon, zoom: PAIR_ZOOM } : null}
      overlay={
        lat === null && (
          // Same «position pending» note as the static map: nothing is placed on the globe
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-2">
            <span className="flex flex-wrap items-center justify-center gap-x-2 rounded-chip bg-map px-2.5 py-1 text-caption">
              <span aria-hidden="true" className="size-3 shrink-0 rounded-full border-2 border-dashed border-current" />
              <span className="text-foreground">{pairName ?? t('state.pending')}</span>
              <span className="text-muted">{t('earthMap.pending')}</span>
            </span>
          </div>
        )
      }
    />
  )
}
