import { useTranslation } from 'react-i18next'
import { Chip } from '@/shared/ui/Chip'
import { Icon } from '@/shared/ui/Icon'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { SECTION } from '@/features/landing/components/styles'

// Same names as the Earth limits box of the explorer, so both say exactly the same
const LIMITS = ['gravity', 'vacuum', 'atmosphere', 'radiation'] as const

export function LimitsSection() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="landing-limits" className={SECTION}>
      <div className="flex flex-col gap-6 rounded-frame border border-dashed border-border bg-surface p-6 md2:flex-row md2:items-center md2:justify-between md2:p-10">
        <div className="flex max-w-xl flex-col gap-4">
          <SectionHeading id="landing-limits" eyebrow={t('landing.limits.eyebrow')} title={t('landing.limits.title')} />
          <p className="text-body text-muted">{t('landing.limits.text')}</p>
        </div>
        <ul className="flex flex-wrap gap-2 md2:max-w-sm">
          {LIMITS.map((limit) => (
            <li key={limit}>
              {/* Always icon and word, never the colour alone */}
              <Chip className="border-verdict-fail font-medium">
                <Icon name="cross" size={14} className="text-verdict-fail" />
                {t(`earthLimits.${limit}`)}
              </Chip>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
