import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { SECTION } from '@/features/landing/components/styles'

const SOURCES = ['earthdata', 'dem', 'lro', 'trek'] as const

export function DataSection() {
  const { t } = useTranslation()

  return (
    <section id="datos" aria-labelledby="landing-data" className={SECTION}>
      <SectionHeading id="landing-data" eyebrow={t('landing.data.eyebrow')} title={t('landing.data.title')} />
      <ul className="grid gap-4 md2:grid-cols-4">
        {SOURCES.map((source) => (
          <li key={source} className="flex flex-col gap-1.5 border-t border-border pt-4">
            <strong className="font-display text-card-title font-bold">{t(`landing.data.${source}Title`)}</strong>
            <span className="text-compact text-muted">{t(`landing.data.${source}`)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
