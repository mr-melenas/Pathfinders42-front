import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { BODY_LABEL_KEYS, type Body } from '@/shared/i18n/labels'
import { siteMarkerElement } from '@/shared/lib/globeMarkers'
import type { MapSite } from '@/shared/lib/mapProjection'
import { Globe, type GlobeImagery } from '@/shared/ui/Globe'

// OpenPlanetaryMap basemaps (Web Mercator, CORS open; real detail up to zoom 6, checked 15 nov)
const IMAGERY: Record<Body, GlobeImagery> = {
  luna: {
    tiles: 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png',
    maxzoom: 6,
  },
  marte: {
    tiles: 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png',
    maxzoom: 6,
  },
}

const SITE_ZOOM = 3.5 // close to the site, still showing its region

type BodyGlobeProps = {
  cuerpo: Body
  sites: MapSite[]
  selectedId?: string // the site of the current page: highlighted, and the globe turns to it
  caption: string
}

// The Moon or Mars as a 3D globe, one marker per site (same shapes as the SVG maps); a click opens the site
export function BodyGlobe({ cuerpo, sites, selectedId, caption }: BodyGlobeProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Stable while the sites and the selection do not change, so the globe is not rebuilt on every render
  const markers = useMemo(
    () =>
      sites.flatMap(({ id, nombre, tipo, lat, lon }) =>
        lat === null || lon === null
          ? []
          : [{ id, lat, lon, element: () => siteMarkerElement(tipo, nombre, id === selectedId) }],
      ),
    [sites, selectedId],
  )
  const selected = sites.find((site) => site.id === selectedId)
  const focus =
    selected && selected.lat !== null && selected.lon !== null
      ? { lat: selected.lat, lon: selected.lon, zoom: SITE_ZOOM }
      : null
  const onSelect = useCallback((id: string) => void navigate(`/${cuerpo}/${id}`), [navigate, cuerpo])

  return (
    <Globe
      cuerpo={cuerpo}
      imagery={IMAGERY[cuerpo]}
      label={t('bodyMap.global', { body: t(BODY_LABEL_KEYS[cuerpo]) })}
      caption={caption}
      markers={markers}
      focus={focus}
      onSelect={onSelect}
      initialZoom={1.3}
    />
  )
}
