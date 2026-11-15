import { useTranslation } from 'react-i18next'
import { BODY_LABEL_KEYS, type Body } from '@/shared/i18n/labels'
import { toEquirectangular, type MapSite } from '@/shared/lib/mapProjection'
import { MapFrame } from '@/shared/ui/MapFrame'
import { SiteMarker } from '@/shared/ui/SiteMarker'

// NASA Solar System Treks equirectangular mosaics. Zoom level 1 = 2 rows × 4 columns of 256 px tiles (checked 15 nov)
const TREK_LEVEL_1: Record<Body, string> = {
  luna: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/1',
  marte: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/1',
}
const TILES = [0, 1].flatMap((row) => [0, 1, 2, 3].map((column) => `${row}/${column}`))

type BodyMapProps = {
  cuerpo: Body
  sites: MapSite[]
  selectedId?: string // the site of the current page, highlighted
  caption?: string // what the map shows and where it comes from; Explore's text by default
}

// Whole body, west on the left: the Trek image and one marker per site
export function BodyMap({ cuerpo, sites, selectedId, caption }: BodyMapProps) {
  const { t } = useTranslation()

  return (
    <MapFrame
      cuerpo={cuerpo}
      label={t('bodyMap.global', { body: t(BODY_LABEL_KEYS[cuerpo]) })}
      caption={caption ?? t('bodyMap.caption')}
      className="aspect-2/1"
    >
      {/* Decorative: the caption says what it is */}
      <div aria-hidden="true" className="grid grid-cols-4">
        {TILES.map((tile) => (
          <img key={tile} src={`${TREK_LEVEL_1[cuerpo]}/${tile}.jpg`} alt="" className="block w-full" />
        ))}
      </div>
      {/* Hidden from screen readers: the same links are elsewhere on the page */}
      <div aria-hidden="true" className="absolute inset-0">
        {sites.map(({ id, nombre, tipo, lat, lon }) =>
          lat === null || lon === null ? null : (
            <SiteMarker
              key={id}
              to={`/${cuerpo}/${id}`}
              name={nombre}
              tipo={tipo}
              point={toEquirectangular(lon, lat)}
              selected={id === selectedId}
            />
          ),
        )}
      </div>
    </MapFrame>
  )
}
