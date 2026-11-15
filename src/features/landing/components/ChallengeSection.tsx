import { useTranslation } from 'react-i18next'
import earthNight from '@/assets/landing/earth-night.jpg'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { FRAME, SECTION } from '@/features/landing/components/styles'

export function ChallengeSection() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="landing-challenge" className={SECTION}>
      <div className="grid items-center gap-10 md2:grid-cols-2">
        <div className="flex flex-col gap-5">
          <SectionHeading id="landing-challenge" eyebrow={t('landing.challenge.eyebrow')} title={t('landing.challenge.title')} />
          <p className="max-w-prose text-body text-muted">{t('landing.challenge.p1')}</p>
          <p className="max-w-prose text-body text-foreground">{t('landing.challenge.p2')}</p>
        </div>
        <figure className={`flex flex-col ${FRAME}`}>
          <img src={earthNight} alt={t('landing.challenge.imageAlt')} loading="lazy" className="aspect-video w-full object-cover" />
          <figcaption className="bg-surface px-4 py-3 text-caption text-muted">{t('landing.challenge.caption')}</figcaption>
        </figure>
      </div>
    </section>
  )
}
