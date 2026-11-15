import { useTranslation } from 'react-i18next'
import { useSite } from '@/shared/api/queries'
import { ErrorState } from '@/shared/ui/ErrorState'
import { LoadingState } from '@/shared/ui/LoadingState'
import { BestPairPanel } from '@/features/site-detail/components/BestPairPanel'
import { MapsRow } from '@/features/site-detail/components/MapsRow'
import { PlainSummary } from '@/features/site-detail/components/PlainSummary'
import { SiteHeader } from '@/features/site-detail/components/SiteHeader'
import { VerdictPanel } from '@/features/site-detail/components/VerdictPanel'

type SiteDetailPageProps = {
  siteId: string // the API's site id, e.g. "artemis-malapert-massif"
}

// Detail of one site: loading → error (with retry) → header on top and the two panels below
export function SiteDetailPage({ siteId }: SiteDetailPageProps) {
  const { t } = useTranslation()
  const { data, isPending, isError, error, refetch } = useSite(siteId)

  // Roughly the height of the page, so it does not jump when the data arrives
  if (isPending) return <LoadingState className="h-96" />
  // ErrorState picks the message from the status: 404 unknown site, 503 API without data…
  if (isError)
    return (
      <div className="flex flex-col gap-3">
        {/* The site name is unknown here, but the page still needs its one <h1> */}
        <h1 className="font-display text-site-title font-extrabold tracking-display">{t('siteDetail.errorTitle')}</h1>
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    )

  return (
    <div className="flex flex-col gap-4">
      <SiteHeader site={data} />
      <PlainSummary site={data} />
      <MapsRow site={data} />
      {/* One column on phones; two columns from 820 px, as in the final design */}
      <div className="grid items-start gap-4 md2:grid-cols-2">
        <VerdictPanel site={data} />
        <BestPairPanel resumen={data.resumen} />
      </div>
    </div>
  )
}
