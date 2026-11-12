import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import { formatArea, formatCoordinate, formatNumber, formatTemperature } from '@/shared/lib/format'
import { SegmentedToggle } from '@/shared/ui/SegmentedToggle'

// Typed keys: a key that does not exist in es.json fails the build
const KEYS = [
  'verdict.pass', 'verdict.fail', 'verdict.null', 'verdict.nullShort',
  'state.loading', 'state.error', 'state.retry', 'state.empty', 'state.pending',
  'body.moon', 'body.mars', 'toggle.body', 'toggle.language',
] as const

export function I18nSection() {
  const { t, i18n } = useTranslation()
  const language = i18n.language

  // Real values from docs/CONTEXTO_PATHFINDERS42.md §6 (Malapert Massif), never made-up numbers
  const samples = [
    { source: 'distancia: 0.229', formatted: formatNumber(0.229, language) },
    { source: 'brecha_ts_media: -121.7', formatted: formatTemperature(-121.7, language) },
    { source: 'area_km2: 441.0', formatted: formatArea(441.0, language) },
    { source: 'lat: -85.9948', formatted: formatCoordinate(-85.9948, language) },
  ]

  return (
    <section aria-labelledby="style-guide-i18n" className="flex flex-col gap-3">
      <h3 id="style-guide-i18n" className="font-display text-card-title font-bold">
        i18n
      </h3>

      <SegmentedToggle
        label={t('toggle.language')}
        options={SUPPORTED_LANGUAGES.map((option) => ({ value: option, label: option.toUpperCase() }))}
        value={language}
        onChange={(next) => void i18n.changeLanguage(next)}
      />

      <dl className="flex flex-col gap-1 rounded-card bg-surface p-3">
        {KEYS.map((key) => (
          <div key={key} className="flex flex-wrap gap-x-4">
            <dt className="font-mono text-data text-muted">{key}</dt>
            <dd>{t(key)}</dd>
          </div>
        ))}
        {samples.map(({ source, formatted }) => (
          <div key={source} className="flex flex-wrap gap-x-4">
            <dt className="font-mono text-data text-muted">{source}</dt>
            <dd className="font-mono tabular-nums">{formatted}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
