import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useAnalogues, useSite } from '@/shared/api/queries'
import { BODY_LABEL_KEYS, isBody, isSiteType } from '@/shared/i18n/labels'
import { LoadingState } from '@/shared/ui/LoadingState'
import { VerdictChip } from '@/shared/ui/VerdictChip'

// The example of the proposal, filled with real API data instead of placeholders
const EXAMPLE_SITE = 'apollo-11'

export function ExampleResult() {
  const { t } = useTranslation()
  const { data: site, isError } = useSite(EXAMPLE_SITE)
  const { data: analogues } = useAnalogues(EXAMPLE_SITE, 1)

  // An example that cannot load is simply left out: the rest of the page does not depend on it
  if (isError) return null
  if (!site) return <LoadingState className="h-72" />

  const verdicts = Object.values(site.parecidos)
  // Only === true counts as "works": null (the layer does not decide) is neither "works" nor "fails"
  const working = verdicts.filter((verdict) => verdict === true).length
  const body = isBody(site.cuerpo) ? t(BODY_LABEL_KEYS[site.cuerpo]) : site.cuerpo
  const type = isSiteType(site.tipo) ? t(`siteType.${site.tipo}`) : site.tipo
  const pair = analogues?.[0]?.tierra_nombre

  return (
    <article aria-label={t('landing.how.exampleLabel')} className="flex flex-col gap-4 rounded-container border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-caption text-muted">
            {body} · {type}
          </p>
          <h3 className="font-display text-card-title font-bold">{site.nombre}</h3>
        </div>
        <span className="rounded-chip bg-surface-2 px-2.5 py-1 text-caption">
          {t('verdictPanel.tally', { working, count: verdicts.length })}
        </span>
      </div>
      {pair && (
        <p className="rounded-row bg-surface-2 px-3 py-2 text-compact">
          <span className="text-muted">{t('landing.how.pair')}</span> <strong className="font-semibold">{pair}</strong>
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {site.resumen.map((layer) => (
          <li key={layer.capa} className="flex items-center justify-between gap-2 rounded-row bg-surface-2 px-3 py-2 text-compact">
            <span>{t(`layer.${layer.capa}.name`)}</span>
            <VerdictChip value={layer.hay_parecido} short />
          </li>
        ))}
      </ul>
      <p className="text-caption text-muted">{t('landing.how.limits')}</p>
      <Link to={`/${site.cuerpo}/${site.id}`} className="self-start text-compact text-horizon underline underline-offset-3 hover:text-foreground">
        {t('landing.how.seeSite', { site: site.nombre })}
      </Link>
    </article>
  )
}
