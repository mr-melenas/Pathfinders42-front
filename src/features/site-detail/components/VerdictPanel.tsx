import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { LayerRow } from '@/features/site-detail/components/LayerRow'

type Site = components['schemas']['SitioDetalle']

type VerdictPanelProps = {
  site: Site // GET /sitios/{id}, with the type generated from the OpenAPI
}

export function VerdictPanel({ site }: VerdictPanelProps) {
  const { t } = useTranslation()
  const headingId = useId()

  const verdicts = Object.values(site.parecidos)
  // Only === true counts as "works": null (the layer does not decide) is neither "works" nor "fails"
  const working = verdicts.filter((verdict) => verdict === true).length

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={headingId} className="font-display text-panel-title font-extrabold tracking-display">
          {t('verdictPanel.title')}
        </h2>
        <p className="text-caption text-muted">{t('verdictPanel.tally', { working, count: verdicts.length })}</p>
      </div>
      <ul className="flex flex-col gap-0.5">
        {site.resumen.map((layer) => (
          <li key={layer.capa}>
            <LayerRow layer={layer} />
          </li>
        ))}
      </ul>
    </section>
  )
}
