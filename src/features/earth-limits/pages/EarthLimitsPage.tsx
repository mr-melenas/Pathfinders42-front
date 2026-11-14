import { useTranslation } from 'react-i18next'

// Placeholder: the texts and their sources arrive with E7
export function EarthLimitsPage() {
  const { t } = useTranslation()

  return <h1 className="font-display text-site-title font-extrabold tracking-display">{t('nav.earthLimits')}</h1>
}
