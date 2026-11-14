import { useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { isVerificationStatus } from '@/shared/i18n/labels'
import { formatNumber } from '@/shared/lib/format'
import { VerdictChip } from '@/shared/ui/VerdictChip'

type LayerSummary = components['schemas']['ResumenCapa']

type LayerRowProps = {
  layer: LayerSummary // one item of "resumen" from GET /sitios/{id}
}

// One layer of the "where it works / where it fails" panel: the site's verdict, the layer and its best pair
export function LayerRow({ layer }: LayerRowProps) {
  const { t, i18n } = useTranslation()
  const { capa, hay_parecido, mejor } = layer
  const verificacion = mejor?.detalles.verificacion

  let detail = <>{t('state.pending')}</>
  if (mejor) {
    detail = (
      <>
        {mejor.nombre}
        {typeof mejor.distancia === 'number' && (
          <>
            {' · '}
            <span className="font-mono tabular-nums text-foreground">distancia {formatNumber(mejor.distancia, i18n.language)}</span>
          </>
        )}
        {typeof verificacion === 'string' && isVerificationStatus(verificacion) && ` · ${t(`verification.${verificacion}`)}`}
      </>
    )
  }

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-row bg-surface p-3">
      <VerdictChip value={hay_parecido} />
      <span className="text-compact font-semibold">{t(`layer.${capa}.name`)}</span>
      <p className="col-start-2 text-caption text-muted">{detail}</p>
    </div>
  )
}
