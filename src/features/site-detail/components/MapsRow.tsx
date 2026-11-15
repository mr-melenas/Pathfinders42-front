import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { isBody } from '@/shared/i18n/labels'
import { POLAR_EDGE_LAT } from '@/shared/lib/mapProjection'
import { BodyMap } from '@/shared/ui/BodyMap'
import { SouthPoleMap } from '@/shared/ui/SouthPoleMap'
import { EarthMap } from '@/features/site-detail/components/EarthMap'
import { MapBridge } from '@/features/site-detail/components/MapBridge'
import { pickBestLayer } from '@/features/site-detail/components/pickBestLayer'

// MapLibre is only downloaded when a site detail is opened; the static map shows meanwhile
const EarthGlobe = lazy(() =>
  import('@/features/site-detail/components/EarthGlobe').then((module) => ({ default: module.EarthGlobe })),
)

type Site = components['schemas']['SitioDetalle']

type MapsRowProps = {
  site: Site
}

// Body map · bridge · Earth globe, at the same height (all 2:1); stacked below 820 px
export function MapsRow({ site }: MapsRowProps) {
  const { t } = useTranslation()
  // The same layer as the «Mejor pareja» panel
  const best = pickBestLayer(site.resumen)
  const pair = best?.mejor ?? null
  const pairName = pair?.nombre ?? null
  // Where the pair is on Earth, straight from the API; both values or none, never a half position
  const position =
    typeof pair?.lat === 'number' && typeof pair.lon === 'number' ? { lat: pair.lat, lon: pair.lon } : null

  const { cuerpo } = site
  if (!isBody(cuerpo)) return null
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
        <Suspense fallback={<EarthMap pairName={pairName} />}>
          <EarthGlobe pairName={pairName} position={position} />
        </Suspense>
      </div>
    </div>
  )
}
