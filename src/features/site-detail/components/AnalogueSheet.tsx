import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { useAnalogue } from '@/shared/api/queries'
import { Chip } from '@/shared/ui/Chip'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Icon } from '@/shared/ui/Icon'
import { LinkButton } from '@/shared/ui/LinkButton'
import { LoadingState } from '@/shared/ui/LoadingState'
import { VerificationChip } from '@/shared/ui/VerificationChip'

type Point = components['schemas']['PuntoAnalogo']

type PointListProps = {
  title: string
  points: Point[]
  pass: boolean // true: «Funciona» (pros), false: «Falla» (cons)
  lang: 'es' | 'en'
}

// One column: each point with the verdict icon and word of its column, never the colour alone
function PointList({ title, points, pass, lang }: PointListProps) {
  const { t } = useTranslation()
  const color = pass ? 'text-verdict-pass' : 'text-verdict-fail'
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className={`flex items-center gap-1.5 font-semibold ${color}`}>
        <Icon name={pass ? 'check' : 'cross'} size={16} />
        {title}
      </h4>
      {points.length === 0 ? (
        <p className="text-caption text-muted italic">{t('analogues.none')}</p>
      ) : (
        <ul className="flex flex-col gap-1.5 text-compact">
          {points.map((point, index) => (
            <li key={index} className="flex gap-1.5">
              <Icon name={pass ? 'check' : 'cross'} size={16} className={`mt-0.5 shrink-0 ${color}`} />
              <span>
                {point.texto[lang]}
                {point.url && (
                  <>
                    {' '}
                    <LinkButton href={point.url}>{t('analogues.source')}</LinkButton>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

type AnalogueSheetProps = {
  siteId: string
  earthId: string
}

// Where the analogue works, where it fails and what was not measured, as the back precomputes it (texts in es/en)
export function AnalogueSheet({ siteId, earthId }: AnalogueSheetProps) {
  const { t, i18n } = useTranslation()
  const headingId = useId()
  const { data, isPending, isError, error, refetch } = useAnalogue(siteId, earthId)
  const lang = i18n.language === 'en' ? 'en' : 'es'

  if (isPending) return <LoadingState className="h-40" />
  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />

  return (
    <article aria-labelledby={headingId} className="flex flex-col gap-3 rounded-card bg-surface-2 p-3.5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={headingId} className="font-display text-card-title font-bold">
          {data.tierra_nombre}
        </h3>
        <VerificationChip status={data.verificacion} />
      </header>
      <p className="text-compact">{data.resumen[lang]}</p>
      <div className="grid gap-3 md2:grid-cols-2">
        <PointList title={t('analogues.works')} points={data.pros} pass lang={lang} />
        <PointList title={t('analogues.fails')} points={data.contras} pass={false} lang={lang} />
      </div>
      {data.sin_dato.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <h4 className="font-semibold">{t('analogues.unmeasured')}</h4>
          <ul className="flex flex-wrap gap-1.5">
            {data.sin_dato.map((layer) => (
              <li key={layer}>
                {/* Same look as null («does not decide»): striped, dashed, with a dash icon */}
                <Chip className="stripes-null border-dashed border-verdict-null text-verdict-null">
                  <Icon name="dash" size={14} />
                  {t(`layer.${layer === 'forma_cueva' ? 'cuevas' : layer}.name`)}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.rasgo && (
        // The data sheet's trait comes only in Spanish
        <p lang="es" className="text-caption text-muted">
          {data.rasgo}
          {data.referencia && (
            <>
              {' · '}
              {data.url ? <LinkButton href={data.url}>{data.referencia}</LinkButton> : data.referencia}
            </>
          )}
        </p>
      )}
    </article>
  )
}
