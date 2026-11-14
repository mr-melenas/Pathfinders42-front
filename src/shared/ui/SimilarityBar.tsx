import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/shared/lib/format'

type SimilarityBarProps = {
  distancia?: number | null // the pair's "distancia": 0 = identical, 1 = nothing alike
  parecido: boolean | null // the pair's verdict: only used to stripe the fill when it is null
}

// How alike the pair is: extra information, never the verdict, so the fill is neutral on purpose
export function SimilarityBar({ distancia, parecido }: SimilarityBarProps) {
  const { t, i18n } = useTranslation()

  // No distance from the API: nothing to draw
  if (typeof distancia !== 'number') return null

  // 1 − distancia as a whole percentage, kept between 0 and 100
  const percent = Math.min(100, Math.max(0, Math.round((1 - distancia) * 100)))
  const fill = parecido === null ? 'stripes-bar' : 'bg-muted'

  return (
    <div
      role="img"
      aria-label={t('similarity.label', { percent, distance: formatNumber(distancia, i18n.language) })}
      className="h-2 overflow-hidden rounded-full border border-border bg-background"
    >
      <div className={`h-full ${fill}`} style={{ width: `${percent}%` }} />
    </div>
  )
}
