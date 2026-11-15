import { useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { formatNumber } from '@/shared/lib/format'

type Layer = components['schemas']['ResumenCapa']['capa']

type MapBridgeProps = {
  capa: Layer | null // layer of the best match; null when no layer has a distance
  distancia: number | null
}

// The orange arc between the two maps: which layer joins them and how close the pair is
export function MapBridge({ capa, distancia }: MapBridgeProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-1 text-center font-mono text-data text-accent md2:w-16 md2:self-center">
      {/* Turned 90° when the maps are stacked, as in the final design; the text stays readable */}
      <svg viewBox="0 0 64 40" aria-hidden="true" className="h-10 w-16 rotate-90 md2:rotate-0">
        <path d="M4 32 A30 26 0 0 1 60 32" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="50" cy="13" r="3" fill="currentColor" />
      </svg>
      <span className="sr-only">{t('mapBridge.label')}</span>
      {capa !== null && distancia !== null ? (
        <>
          <span>{t(`layer.${capa}.name`)}</span>
          <span className="tabular-nums">{formatNumber(distancia, i18n.language)}</span>
        </>
      ) : (
        <span className="text-muted italic">{t('state.pending')}</span>
      )}
    </div>
  )
}
