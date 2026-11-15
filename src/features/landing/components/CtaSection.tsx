import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import ctaImage from '@/assets/landing/cta-horizon.jpg'
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '@/features/landing/components/styles'

const REPOSITORY_URL = 'https://github.com/mr-melenas/Pathfinders42-front'

export function CtaSection() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="landing-cta" className="relative isolate overflow-hidden border-t border-border">
      <img src={ctaImage} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background/75" />
      <div className="mx-auto flex max-w-content flex-col items-center gap-8 px-4 py-24 text-center md2:py-32">
        <h2 id="landing-cta" className="max-w-3xl font-display text-section font-extrabold tracking-display text-balance">
          {t('landing.cta.title')}
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/luna" className={PRIMARY_BUTTON}>
            {t('landing.nav.open')}
          </Link>
          <a href={REPOSITORY_URL} className={SECONDARY_BUTTON}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
            </svg>
            {t('landing.cta.code')}
          </a>
        </div>
      </div>
    </section>
  )
}
