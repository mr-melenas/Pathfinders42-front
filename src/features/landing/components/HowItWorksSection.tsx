import { useTranslation } from 'react-i18next'
import explorerImage from '@/assets/landing/explorer.jpg'
import { ExampleResult } from '@/features/landing/components/ExampleResult'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { FRAME, SECTION } from '@/features/landing/components/styles'

const STEPS = [
  { titleKey: 'landing.how.step1Title', textKey: 'landing.how.step1' },
  { titleKey: 'landing.how.step2Title', textKey: 'landing.how.step2' },
  { titleKey: 'landing.how.step3Title', textKey: 'landing.how.step3' },
] as const

export function HowItWorksSection() {
  const { t } = useTranslation()

  return (
    <section id="como" aria-labelledby="landing-how" className={SECTION}>
      <SectionHeading id="landing-how" eyebrow={t('landing.how.eyebrow')} title={t('landing.how.title')} />
      {/* A real sequence, so the numbers say something */}
      <ol className="grid gap-4 md2:grid-cols-3">
        {STEPS.map(({ titleKey, textKey }, index) => (
          <li key={titleKey} className="flex flex-col gap-2 rounded-container border border-border bg-surface p-5">
            <span aria-hidden="true" className="font-mono text-data font-semibold text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-card-title font-bold">{t(titleKey)}</h3>
            <p className="text-compact text-muted">{t(textKey)}</p>
          </li>
        ))}
      </ol>
      <div className="grid items-start gap-6 md2:grid-cols-2">
        <ExampleResult />
        <figure className={`flex flex-col ${FRAME}`}>
          <img src={explorerImage} alt={t('landing.how.explorerAlt')} loading="lazy" className="w-full" />
          <figcaption className="bg-surface px-4 py-3 text-caption text-muted">{t('landing.how.explorerCaption')}</figcaption>
        </figure>
      </div>
    </section>
  )
}
