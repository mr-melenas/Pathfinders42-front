import type { ReactNode } from 'react'
import { SiteHeader, VerdictPanel } from '@/features/site-detail'
import { useSite } from '@/shared/api/queries'
import { ErrorState } from '@/shared/ui/ErrorState'
import { LayerCard } from '@/shared/ui/LayerCard'
import { LoadingState } from '@/shared/ui/LoadingState'

type LiveSiteProps = {
  siteId: string
}

// One site requested from the API: loading → error (with retry) → its header and layer cards
export function LiveSite({ siteId }: LiveSiteProps) {
  const { data, isPending, isError, error, refetch } = useSite(siteId)

  let content: ReactNode
  if (isPending) {
    content = <LoadingState className="h-40" />
  } else if (isError) {
    content = <ErrorState error={error} onRetry={() => void refetch()} />
  } else {
    content = (
      <>
        <SiteHeader site={data} />
        <VerdictPanel site={data} />
        <div className="grid gap-3 md2:grid-cols-2">
          {data.resumen.map((layer) => (
            <LayerCard key={layer.capa} layer={layer} />
          ))}
        </div>
      </>
    )
  }

  return <div className="flex flex-col gap-3 rounded-card bg-surface p-3">{content}</div>
}
