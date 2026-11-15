import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { isBody, type Body } from '@/shared/i18n/labels'
import { Chip } from '@/shared/ui/Chip'
import { Icon } from '@/shared/ui/Icon'

type Limit = 'gravity' | 'vacuum' | 'atmosphere' | 'radiation'

// What Earth can never reproduce for each body (CONTEXTO §1, sistema-visual §6.2). Names only: no figures until
// the data team sends the texts and their sources (#71)
const LIMITS_BY_BODY: Record<Body, readonly Limit[]> = {
  luna: ['gravity', 'vacuum', 'radiation'],
  marte: ['gravity', 'atmosphere', 'radiation'],
}

type EarthLimitsBoxProps = {
  cuerpo: string // the API's "cuerpo"; an unknown body shows no box
}

// «Límites de la Tierra como análogo · siempre fallan»: dashed box, chips with the «fail» border and a ✗ icon
export function EarthLimitsBox({ cuerpo }: EarthLimitsBoxProps) {
  const { t } = useTranslation()
  const headingId = useId()
  if (!isBody(cuerpo)) return null

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2 rounded-card border border-dashed border-border bg-surface p-3">
      <h3 id={headingId} className="text-compact font-semibold">
        {t('earthLimits.title')}
      </h3>
      <ul className="flex flex-wrap gap-1.5">
        {LIMITS_BY_BODY[cuerpo].map((limit) => (
          <li key={limit}>
            {/* Always icon and word, never the colour alone */}
            <Chip className="border-verdict-fail font-medium">
              <Icon name="cross" size={14} className="text-verdict-fail" />
              {t(`earthLimits.${limit}`)}
            </Chip>
          </li>
        ))}
      </ul>
      <p className="text-caption text-muted">{t('earthLimits.note')}</p>
    </section>
  )
}
