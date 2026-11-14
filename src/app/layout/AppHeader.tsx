import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate, useParams } from 'react-router'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import { isBody } from '@/shared/i18n/labels'
import { Logo } from '@/shared/ui/Logo'
import { SegmentedToggle } from '@/shared/ui/SegmentedToggle'

export function AppHeader() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { cuerpo } = useParams()
  // The body comes from the URL (/luna/…, /marte/…); on pages without one, the Moon is the default
  const body = cuerpo !== undefined && isBody(cuerpo) ? cuerpo : 'luna'

  const navLinks = [
    { to: `/${body}`, labelKey: 'nav.explore' },
    { to: '/limites-tierra', labelKey: 'nav.earthLimits' },
  ] as const

  return (
    <header className="horizon-line header-gradient relative flex flex-wrap items-center gap-3.5 overflow-hidden rounded-container border border-header-border px-3.5 py-2.5">
      <Link to="/" aria-label={t('nav.home')} className="rounded-chip">
        <Logo />
      </Link>

      <nav aria-label={t('nav.label')}>
        <ul className="flex flex-wrap gap-1 text-compact">
          {navLinks.map(({ to, labelKey }) => (
            <li key={labelKey}>
              {/* NavLink sets aria-current="page" by itself when its URL is the current one */}
              <NavLink
                to={to}
                className="block rounded-chip px-2.5 py-1.5 text-muted hover:text-foreground aria-[current=page]:bg-surface-2 aria-[current=page]:text-foreground"
              >
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ml-auto flex flex-wrap gap-2">
        <SegmentedToggle
          label={t('toggle.body')}
          options={[
            { value: 'luna', label: t('body.moon') },
            { value: 'marte', label: t('body.mars') },
          ]}
          value={body}
          // Changing body goes to Explore of that body: a Moon site does not exist on Mars
          onChange={(next) => void navigate(`/${next}`)}
        />
        <SegmentedToggle
          label={t('toggle.language')}
          options={SUPPORTED_LANGUAGES.map((option) => ({ value: option, label: option.toUpperCase() }))}
          value={i18n.language}
          onChange={(next) => void i18n.changeLanguage(next)}
        />
      </div>
    </header>
  )
}
