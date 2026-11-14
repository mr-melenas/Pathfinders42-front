import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/shared/ui/EmptyState'
import { LayerCard } from '@/shared/ui/LayerCard'
import { pickBestLayer, type LayerSummary } from '@/features/site-detail/components/pickBestLayer'

type BestPairPanelProps = {
  resumen: LayerSummary[]
}

export function BestPairPanel({ resumen }: BestPairPanelProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const layer = pickBestLayer(resumen)

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2.5">
      <h2 id={headingId} className="font-display text-panel-title font-extrabold tracking-display">
        {t('bestPair.title')}
      </h2>
      {layer ? <LayerCard layer={layer} /> : <EmptyState>{t('state.pending')}</EmptyState>}
    </section>
  )
}
