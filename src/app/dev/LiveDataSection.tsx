import type { ReactNode } from 'react'
import { useSite } from '@/shared/api/queries'
import { ErrorState } from '@/shared/ui/ErrorState'
import { LayerCard } from '@/shared/ui/LayerCard'
import { LoadingState } from '@/shared/ui/LoadingState'

// A real site of the API (CONTEXTO §6)
const SAMPLE_SITE_ID = 'artemis-malapert-massif'

// Live example of a data hook: loading → error (with retry) → the site's real layer cards
export function LiveDataSection() {
  const { data, isPending, isError, error, refetch } = useSite(SAMPLE_SITE_ID)

  let content: ReactNode
  if (isPending) {
    content = <LoadingState className="h-40" />
  } else if (isError) {
    content = <ErrorState error={error} onRetry={() => void refetch()} />
  } else {
    content = (
      <div className="grid gap-3 md2:grid-cols-2">
        {data.resumen.map((layer) => (
          <LayerCard key={layer.capa} layer={layer} />
        ))}
      </div>
    )
  }

  return (
    <section aria-labelledby="style-guide-live" className="flex flex-col gap-3">
      <h3 id="style-guide-live" className="font-display text-card-title font-bold">
        Live data · <code className="font-mono text-data">useSite('{SAMPLE_SITE_ID}')</code>
      </h3>
      {content}
    </section>
  )
}
