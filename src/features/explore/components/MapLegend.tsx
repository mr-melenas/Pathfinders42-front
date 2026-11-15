import { useTranslation } from 'react-i18next'
import type { Body } from '@/shared/i18n/labels'
import type { SiteSummary } from '@/features/explore/components/groupSitesByType'
import { MarkerShape } from '@/shared/ui/MarkerShape'
import { BODY_COLOR, SHAPE_ORDER, shapeOf } from '@/shared/lib/siteShapes'

type MapLegendProps = {
  cuerpo: Body
  sites: SiteSummary[]
}

// What each marker shape means: always the drawing and the word, and only the shapes this body has
export function MapLegend({ cuerpo, sites }: MapLegendProps) {
  const { t } = useTranslation()
  const present = new Set(sites.map((site) => shapeOf(site.tipo)))

  return (
    <ul aria-label={t('mapLegend.label')} className={`flex flex-wrap gap-x-4 gap-y-1.5 text-caption ${BODY_COLOR[cuerpo]}`}>
      {SHAPE_ORDER.filter((shape) => present.has(shape)).map((shape) => (
        <li key={shape} className="flex items-center gap-2">
          <MarkerShape shape={shape} />
          <span className="text-muted">{t(`mapLegend.${shape}`)}</span>
        </li>
      ))}
    </ul>
  )
}
