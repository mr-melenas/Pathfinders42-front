import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import { Logo } from '@/shared/ui/Logo'
import { SegmentedToggle } from '@/shared/ui/SegmentedToggle'

// Provisional URLs until the routes are decided (F0.1); #13 swaps these links for React Router's NavLink
const NAV_LINKS = [
  { href: '/', labelKey: 'nav.explore' },
  { href: '/limites-tierra', labelKey: 'nav.earthLimits' },
] as const

type AppHeaderProps = {
  body: string // API "cuerpo" value: "luna" or "marte"
  onBodyChange: (body: string) => void
}

export function AppHeader({ body, onBodyChange }: AppHeaderProps) {
  const { t, i18n } = useTranslation()
  const currentPath = window.location.pathname

  return (
    <header className="horizon-line header-gradient relative flex flex-wrap items-center gap-3.5 overflow-hidden rounded-container border border-header-border px-3.5 py-2.5">
      <a href="/" aria-label={t('nav.home')} className="rounded-chip">
        <Logo />
      </a>

      <nav aria-label={t('nav.label')}>
        <ul className="flex flex-wrap gap-1 text-compact">
          {NAV_LINKS.map(({ href, labelKey }) => (
            <li key={href}>
              <a
                href={href}
                aria-current={href === currentPath ? 'page' : undefined}
                className="block rounded-chip px-2.5 py-1.5 text-muted hover:text-foreground aria-[current=page]:bg-surface-2 aria-[current=page]:text-foreground"
              >
                {t(labelKey)}
              </a>
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
          onChange={onBodyChange}
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
