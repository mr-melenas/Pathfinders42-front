import { useTranslation } from 'react-i18next'
import fieldTestImage from '@/assets/landing/ai-field-test.jpg'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { FRAME, SECTION } from '@/features/landing/components/styles'

export function AiSection() {
  const { t } = useTranslation()

  return (
    <section id="ia" aria-labelledby="landing-ai" className={SECTION}>
      <div className="grid items-center gap-10 md2:grid-cols-2">
        <figure className={FRAME}>
          <img src={fieldTestImage} alt={t('landing.ai.imageAlt')} loading="lazy" className="aspect-video w-full object-cover" />
        </figure>
        <div className="flex flex-col gap-5">
          <SectionHeading id="landing-ai" eyebrow={t('landing.ai.eyebrow')} title={t('landing.ai.title')} />
          <p className="max-w-prose text-body text-muted">{t('landing.ai.p1')}</p>
          <p className="max-w-prose text-body text-foreground">{t('landing.ai.p2')}</p>
        </div>
      </div>
    </section>
  )
}
