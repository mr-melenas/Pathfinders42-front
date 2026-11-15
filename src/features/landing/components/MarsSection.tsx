import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import marsImage from '@/assets/landing/mars-split.jpg'
import { SECTION } from '@/features/landing/components/styles'

export function MarsSection() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="landing-mars" className={SECTION}>
      <div className="relative isolate flex min-h-96 items-end overflow-hidden rounded-frame border border-border">
        <img src={marsImage} alt={t('landing.mars.imageAlt')} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
        {/* Darkens the bottom so the text keeps its contrast over the image */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="flex w-full flex-wrap items-end justify-between gap-6 p-6 md2:p-10">
          <div className="flex max-w-xl flex-col gap-3">
            <p className="font-mono text-data font-semibold tracking-widest text-body-mars uppercase">{t('landing.mars.eyebrow')}</p>
            <h2 id="landing-mars" className="font-display text-section font-extrabold tracking-display text-balance">
              {t('landing.mars.title')}
            </h2>
            <p className="text-body text-foreground/85">{t('landing.mars.text')}</p>
          </div>
          <Link
            to="/marte"
            className="inline-flex items-center rounded-chip bg-foreground px-4 py-2.5 text-compact font-semibold text-background hover:bg-accent"
          >
            {t('landing.hero.exploreMars')}
          </Link>
        </div>
      </div>
    </section>
  )
}
