import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/shared/lib/format'

// Not a metric: VerificationChip already shows it
const HIDDEN_FIELDS = new Set(['verificacion'])

// The only unit the front knows for sure: "brecha_*" are differences in °C (CONTEXTO §5).
// Any other field gets no unit: never make one up.
function unitOf(field: string): string {
  return field.startsWith('brecha_') ? '°C' : ''
}

type MetricsTableProps = {
  detalles?: Record<string, unknown> | null // the pair's "detalles": each layer has its own fields
}

export function MetricsTable({ detalles }: MetricsTableProps) {
  const { t, i18n } = useTranslation()

  // No details from the API: nothing to draw
  if (!detalles) return null
  const rows = Object.entries(detalles).filter(([field]) => !HIDDEN_FIELDS.has(field))
  if (rows.length === 0) return null

  // Numbers follow the language (0,158 / 0.158, with the typographic minus); text is shown as it comes
  const formatValue = (value: unknown) => {
    if (typeof value === 'number') return formatNumber(value, i18n.language)
    if (typeof value === 'string') return value
    return t('state.pending')
  }

  return (
    <dl className="grid grid-cols-[auto_auto_1fr] items-baseline gap-x-3 gap-y-0.75 text-data">
      {rows.map(([field, value]) => {
        const unit = unitOf(field)
        return (
          <div key={field} className="contents">
            <dt className="font-mono text-muted">{field}</dt>
            <dd className="font-mono tabular-nums">{formatValue(value)}</dd>
            {unit ? <dd className="text-unit text-muted">{unit}</dd> : <dd aria-hidden="true" />}
          </div>
        )
      })}
    </dl>
  )
}
