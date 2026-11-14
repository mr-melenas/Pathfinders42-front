import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/shared/lib/format'

// "brecha_*" are differences in °C (CONTEXTO §5): one decimal and the unit, as in the design.
// Any other field gets no unit: never make one up.
function isTemperatureGap(field: string): boolean {
  return field.startsWith('brecha_')
}

type MetricsTableProps = {
  detalles?: Record<string, unknown> | null // the pair's "detalles": each layer has its own fields
}

export function MetricsTable({ detalles }: MetricsTableProps) {
  const { i18n } = useTranslation()

  // No details from the API: nothing to draw
  if (!detalles) return null

  // Only numbers are metrics: text fields (sitio, cuerpo, tipo_tierra, verificacion…) and nulls are left out
  const rows = Object.entries(detalles).filter((entry): entry is [string, number] => typeof entry[1] === 'number')
  if (rows.length === 0) return null

  return (
    <dl className="grid grid-cols-[auto_auto_1fr] items-baseline gap-x-3 gap-y-0.75 text-data">
      {rows.map(([field, value]) => {
        const temperature = isTemperatureGap(field)
        return (
          <div key={field} className="contents">
            <dt className="font-mono text-muted">{field}</dt>
            <dd className="font-mono tabular-nums">{formatNumber(value, i18n.language, temperature ? 1 : 3)}</dd>
            {temperature ? <dd className="text-unit text-muted">°C</dd> : <dd aria-hidden="true" />}
          </div>
        )
      })}
    </dl>
  )
}
