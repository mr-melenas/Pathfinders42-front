import { useTranslation } from 'react-i18next'
import { isSiteType } from '@/shared/i18n/labels'
import { groupSitesByType, type SiteSummary } from '@/features/explore/components/groupSitesByType'
import { SiteListItem } from '@/features/explore/components/SiteListItem'

type SiteListProps = {
  sites: SiteSummary[]
}

// The sites of one body, one section per type
export function SiteList({ sites }: SiteListProps) {
  const { t, i18n } = useTranslation()
  const groups = groupSitesByType(sites, i18n.language)

  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ tipo, sites: groupSites }) => (
        <section key={tipo} className="flex flex-col gap-2.5">
          <h2 className="font-display text-panel-title font-extrabold tracking-display">
            {/* Unknown types are shown as the API sends them */}
            {isSiteType(tipo) ? t(`siteType.${tipo}`) : tipo}
            <span className="font-normal text-muted"> · {groupSites.length}</span>
          </h2>
          <ul className="grid gap-2 md2:grid-cols-2">
            {groupSites.map((site) => (
              <li key={site.id}>
                <SiteListItem site={site} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
