import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import heroImage from '@/assets/landing/hero-moon.jpg'
import { useSites } from '@/shared/api/queries'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import { Logo } from '@/shared/ui/Logo'
import { SegmentedToggle } from '@/shared/ui/SegmentedToggle'
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '@/features/landing/components/styles'

const SECTION_LINKS = [
  { href: '#como', labelKey: 'landing.nav.how' },
  { href: '#usos', labelKey: 'landing.nav.uses' },
  { href: '#ia', labelKey: 'landing.nav.ai' },
  { href: '#datos', labelKey: 'landing.nav.data' },
] as const

// Header (logo, section links, language, explorer) and the hero, over the Moon image with a slow drift
export function HeroSection() {
  const { t, i18n } = useTranslation()
  // Real counts from the API; nothing is shown until they arrive
  const moonSites = useSites('luna').data?.length
  const marsSites = useSites('marte').data?.length

  return (
    <div className="relative isolate overflow-hidden">
      {/* Decorative background: the drift only runs when the person has not asked for reduced motion */}
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url(${heroImage})` }}
        className="absolute inset-0 -z-20 bg-cover bg-center motion-safe:animate-drift"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-background via-background/75 to-background/10" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-background to-transparent" />

      <header className="mx-auto flex w-full max-w-content flex-wrap items-center gap-4 px-4 py-4">
        <Link to="/" aria-label={t('nav.home')} className="rounded-chip">
          <Logo />
        </Link>
        <nav aria-label={t('landing.nav.label')} className="hidden md2:block">
          <ul className="flex gap-1 text-compact">
            {SECTION_LINKS.map(({ href, labelKey }) => (
              <li key={href}>
                <a href={href} className="block rounded-chip px-2.5 py-1.5 text-muted hover:text-foreground">
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <SegmentedToggle
            label={t('toggle.language')}
            options={SUPPORTED_LANGUAGES.map((option) => ({ value: option, label: option.toUpperCase() }))}
            value={i18n.language}
            onChange={(next) => void i18n.changeLanguage(next)}
          />
          <Link to="/luna" className={PRIMARY_BUTTON}>
            {t('landing.nav.open')}
          </Link>
        </div>
      </header>

      <section aria-labelledby="landing-title" className="mx-auto flex w-full max-w-content flex-col gap-7 px-4 pt-14 pb-20 md2:pt-24 md2:pb-28">
        <p className="flex items-center gap-2 self-start rounded-chip border border-accent/60 px-3 py-1 font-mono text-data font-semibold tracking-widest text-accent uppercase">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {t('landing.hero.badge')}
        </p>
        <h1 id="landing-title" className="max-w-2xl font-display text-hero font-extrabold tracking-display text-balance">
          {t('landing.hero.title')}
        </h1>
        <p className="max-w-prose text-body text-foreground/85">{t('landing.hero.text')}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/luna" className={PRIMARY_BUTTON}>
            {t('landing.hero.exploreMoon')}
            <span aria-hidden="true">→</span>
          </Link>
          <Link to="/marte" className={SECONDARY_BUTTON}>
            {t('landing.hero.exploreMars')}
          </Link>
        </div>
        <dl aria-label={t('landing.hero.statsLabel')} className="flex flex-wrap gap-x-12 gap-y-4 pt-4">
          {[
            { value: moonSites, label: t('landing.hero.moonSites') },
            { value: marsSites, label: t('landing.hero.marsSites') },
            { value: 5, label: t('landing.hero.layers') },
          ].map(({ value, label }) =>
            value === undefined ? null : (
              <div key={label} className="flex flex-col-reverse gap-1">
                <dt className="text-caption text-muted">{label}</dt>
                <dd className="font-display text-section font-extrabold tabular-nums">{value}</dd>
              </div>
            ),
          )}
        </dl>
      </section>
    </div>
  )
}
