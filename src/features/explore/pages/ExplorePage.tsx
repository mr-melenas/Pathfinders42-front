import { useTranslation } from 'react-i18next'
import { BODY_LABEL_KEYS, type Body } from '@/shared/i18n/labels'

type ExplorePageProps = {
  cuerpo: Body // API value, already checked by the router: "luna" or "marte"
}

// Placeholder: the map and the list of sites arrive with E4
export function ExplorePage({ cuerpo }: ExplorePageProps) {
  const { t } = useTranslation()

  return (
    <h1 className="font-display text-site-title font-extrabold tracking-display">
      {t('explore.title', { body: t(BODY_LABEL_KEYS[cuerpo]) })}
    </h1>
  )
}
