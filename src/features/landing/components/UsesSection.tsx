import { useTranslation } from 'react-i18next'
import cavesImage from '@/assets/landing/use-caves.jpg'
import constructionImage from '@/assets/landing/use-construction.jpg'
import iceImage from '@/assets/landing/use-ice.jpg'
import landingImage from '@/assets/landing/use-landing.jpg'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { SECTION } from '@/features/landing/components/styles'

// Four of the API's mission uses (GET /usos), with the images of the proposal
const USES = [
  { image: landingImage, key: 'landing' },
  { image: constructionImage, key: 'construction' },
  { image: iceImage, key: 'ice' },
  { image: cavesImage, key: 'caves' },
] as const

export function UsesSection() {
  const { t } = useTranslation()

  return (
    <section id="usos" aria-labelledby="landing-uses" className={SECTION}>
      <div className="flex flex-col gap-4 md2:flex-row md2:items-end md2:justify-between">
        <SectionHeading id="landing-uses" eyebrow={t('landing.uses.eyebrow')} title={t('landing.uses.title')} />
        <p className="max-w-xs text-compact text-muted">{t('landing.uses.text')}</p>
      </div>
      <ul className="grid gap-5 md2:grid-cols-4">
        {USES.map(({ image, key }) => (
          <li key={key} className="flex flex-col overflow-hidden rounded-container border border-border bg-surface">
            <img src={image} alt={t(`landing.uses.${key}Alt`)} loading="lazy" className="aspect-4/3 w-full object-cover" />
            <div className="flex flex-col gap-1.5 p-4">
              <h3 className="font-display text-card-title font-bold">{t(`landing.uses.${key}Title`)}</h3>
              <p className="text-compact text-muted">{t(`landing.uses.${key}`)}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap items-center gap-2 text-caption text-muted">
        {t('landing.uses.also')}
        <span className="rounded-chip border border-border px-2.5 py-1 text-foreground">{t('landing.uses.mobility')}</span>
        <span className="rounded-chip border border-border px-2.5 py-1 text-foreground">{t('landing.uses.thermal')}</span>
      </p>
    </section>
  )
}
