import { Trans, useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { useUseMatches } from '@/shared/api/queries'
import { formatTemperature } from '@/shared/lib/format'
import { plainSummaryParts, type SummaryLayer } from '@/features/site-detail/components/summaryParts'

type Site = components['schemas']['SitioDetalle']

type PlainSummaryProps = {
  site: Site
}

// The sentence anyone understands, before the numbers (sistema-visual §6.2). Built only from API fields
export function PlainSummary({ site }: PlainSummaryProps) {
  const { t, i18n } = useTranslation()
  // The best Earth place for the "general" use: one single place with the layers that work for IT
  const { data, isPending } = useUseMatches(site.id, 'general', 1)
  // Waits for the best place, so the sentence does not change while the page is being read
  if (isPending) return null

  const parts = plainSummaryParts(site, data?.[0] ?? null)
  if (parts === null) return null

  // «el relieve y la roca» / «relief and rock»: each language joins lists its own way
  const list = (layers: SummaryLayer[]) =>
    new Intl.ListFormat(i18n.language, { type: 'conjunction' }).format(layers.map((layer) => t(`summary.layer.${layer}`)))

  return (
    <p className="max-w-lede font-display text-lede font-bold">
      {parts.match && (
        <Trans
          i18nKey="summary.match"
          values={{ site: site.nombre, pair: parts.match.pairName, layers: list(parts.match.layers) }}
          components={{ pass: <span className="text-verdict-pass" /> }}
        />
      )}{' '}
      {parts.fails.length > 0 && (
        <Trans
          i18nKey="summary.fails"
          values={{ layers: list(parts.fails) }}
          components={{ fail: <span className="text-verdict-fail" /> }}
        />
      )}{' '}
      {parts.climate &&
        t(parts.climate.gapC < 0 ? 'summary.colder' : 'summary.warmer', {
          gap: formatTemperature(Math.abs(parts.climate.gapC), i18n.language),
          pair: parts.climate.pairName,
        })}
    </p>
  )
}
