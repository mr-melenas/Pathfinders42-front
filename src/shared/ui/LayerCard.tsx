import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { MetricsTable } from '@/shared/ui/MetricsTable'
import { SimilarityBar } from '@/shared/ui/SimilarityBar'
import { SourceFooter } from '@/shared/ui/SourceFooter'
import { VerdictChip } from '@/shared/ui/VerdictChip'
import { VerificationChip } from '@/shared/ui/VerificationChip'

// One item of "resumen" from GET /sitios/{id}, with the type generated from the OpenAPI
type LayerSummary = components['schemas']['ResumenCapa']

// Verdict stripe on the left edge: only true and false have one, null has none (sistema-visual §2.6)
function stripeFor(hayParecido: boolean | null): string {
  switch (hayParecido) {
    case true:
      return 'shadow-stripe-pass'
    case false:
      return 'shadow-stripe-fail'
    case null:
      return ''
  }
}

type LayerCardProps = {
  layer: LayerSummary
  onShowAllPairs?: () => void // "ver todas" in the footer: only shown when given
}

export function LayerCard({ layer, onShowAllPairs }: LayerCardProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const { capa, hay_parecido, mejor, n_parejas } = layer

  return (
    <article
      aria-labelledby={headingId}
      className={`flex flex-col gap-2.5 rounded-card border border-border bg-surface-2 p-3.5 ${stripeFor(hay_parecido)}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-2.5">
        <div>
          <h3 id={headingId} className="font-display text-card-title font-bold">
            {t(`layer.${capa}.name`)}
          </h3>
          <p className="text-caption text-muted">{t(`layer.${capa}.description`)}</p>
        </div>
        {/* The site's verdict for this layer */}
        <VerdictChip value={hay_parecido} />
      </header>

      {mejor ? (
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-compact font-semibold">{mejor.nombre}</span>
            <VerificationChip status={typeof mejor.detalles.verificacion === 'string' ? mejor.detalles.verificacion : null} />
          </div>
          {/* The pair's own verdict: it can differ from the site's one (site «Falla», pair «No decide») */}
          <div className="flex items-center gap-1.5 text-data text-muted">
            {t('layerCard.pairVerdict')} <VerdictChip value={mejor.parecido} short />
          </div>
          <SimilarityBar distancia={mejor.distancia} parecido={mejor.parecido} />
          <MetricsTable detalles={{ distancia: mejor.distancia, ...mejor.detalles }} />
        </div>
      ) : (
        <p className="text-caption text-muted italic">{t('state.pending')}</p>
      )}

      <SourceFooter capa={capa} n_parejas={n_parejas} onShowAll={onShowAllPairs} />
    </article>
  )
}
