import { useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { isBody } from '@/shared/i18n/labels'
import { POLAR_EDGE_LAT } from '@/shared/lib/mapProjection'
import { BodyMap } from '@/shared/ui/BodyMap'
import { SouthPoleMap } from '@/shared/ui/SouthPoleMap'
import { EarthMap } from '@/features/site-detail/components/EarthMap'
import { MapBridge } from '@/features/site-detail/components/MapBridge'
import { pickBestLayer } from '@/features/site-detail/components/pickBestLayer'

type Site = components['schemas']['SitioDetalle']

type MapsRowProps = {
  site: Site
}

// Body map · bridge · Earth map, at the same height (all 2:1); stacked below 820 px
export function MapsRow({ site }: MapsRowProps) {
  const { t } = useTranslation()
  const { cuerpo } = site
  if (!isBody(cuerpo)) return null

  // The same layer as the «Mejor pareja» panel
  const best = pickBestLayer(site.resumen)
  // Sites near the Moon's south pole go on the polar view, where they are not squeezed against the edge
  const polar = cuerpo === 'luna' && site.lat !== null && site.lat < POLAR_EDGE_LAT

  return (
    <div className="flex flex-col gap-2.5 md2:flex-row md2:items-start">
      <div className="min-w-0 flex-1">
        {polar ? (
          <SouthPoleMap sites={[site]} selectedId={site.id} className="aspect-2/1" />
        ) : (
          <BodyMap cuerpo={cuerpo} sites={[site]} selectedId={site.id} caption={t('bodyMap.imageSource')} />
        )}
      </div>
      <MapBridge capa={best?.capa ?? null} distancia={best?.mejor?.distancia ?? null} />
      <div className="min-w-0 flex-1">
        <EarthMap pairName={best?.mejor?.nombre ?? null} />
      </div>
    </div>
  )
}
