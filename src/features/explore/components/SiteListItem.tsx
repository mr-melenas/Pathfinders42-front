import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { SiteSummary } from '@/features/explore/components/groupSitesByType'

type SiteListItemProps = {
  site: SiteSummary
}

// One site of the list: the whole card is the link to its detail
export function SiteListItem({ site }: SiteListItemProps) {
  const { t } = useTranslation()
  const verdicts = Object.values(site.parecidos)
  // Only === true counts as "works": null (the layer does not decide) is neither "works" nor "fails"
  const working = verdicts.filter((verdict) => verdict === true).length

  return (
    <Link
      to={`/${site.cuerpo}/${site.id}`}
      className="flex h-full flex-col gap-1 rounded-row bg-surface p-3 hover:bg-surface-2"
    >
      <span className="font-semibold">{site.nombre}</span>
      <span className="text-caption text-muted">{t('verdictPanel.tally', { working, count: verdicts.length })}</span>
    </Link>
  )
}
