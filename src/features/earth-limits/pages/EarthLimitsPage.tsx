import { useTranslation } from 'react-i18next'
import { BODY_LABEL_KEYS } from '@/shared/i18n/labels'
import { EarthLimitsBox } from '@/shared/ui/EarthLimitsBox'

const BODIES = ['luna', 'marte'] as const

// What Earth can never reproduce, body by body. The explanations and their sources arrive with #71
export function EarthLimitsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-site-title font-extrabold tracking-display">{t('nav.earthLimits')}</h1>
      <div className="grid items-start gap-4 md2:grid-cols-2">
        {BODIES.map((cuerpo) => (
          <section key={cuerpo} className="flex flex-col gap-2.5">
            <h2 className="font-display text-panel-title font-extrabold tracking-display">{t(BODY_LABEL_KEYS[cuerpo])}</h2>
            <EarthLimitsBox cuerpo={cuerpo} />
            <p className="text-caption text-muted italic">{t('earthLimits.pending')}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
