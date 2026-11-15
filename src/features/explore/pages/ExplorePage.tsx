import { lazy, Suspense, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSites } from '@/shared/api/queries'
import { BODY_LABEL_KEYS, type Body } from '@/shared/i18n/labels'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { LoadingState } from '@/shared/ui/LoadingState'
import { GlobePlaceholder } from '@/shared/ui/GlobePlaceholder'
import { MapLegend } from '@/features/explore/components/MapLegend'
import { SiteList } from '@/features/explore/components/SiteList'
import { SouthPoleMap } from '@/shared/ui/SouthPoleMap'

// MapLibre is downloaded on demand; the globe's empty frame shows meanwhile
const BodyGlobe = lazy(() => import('@/shared/ui/BodyGlobe').then((module) => ({ default: module.BodyGlobe })))

type ExplorePageProps = {
  cuerpo: Body // API value, already checked by the router: "luna" or "marte"
}

// Explore one body: for now the list of its sites (the map arrives later in E4)
export function ExplorePage({ cuerpo }: ExplorePageProps) {
  const { t } = useTranslation()
  const { data, isPending, isError, error, refetch } = useSites(cuerpo)

  let content: ReactNode
  if (isPending) content = <LoadingState className="h-96" />
  else if (isError) content = <ErrorState error={error} onRetry={() => void refetch()} />
  else if (data.length === 0) content = <EmptyState />
  else {
    const globeCaption =
      cuerpo === 'luna'
        ? `${t('bodyGlobe.exploreCaption')} ${t('bodyGlobe.polarNote')}`
        : t('bodyGlobe.exploreCaption')
    content = (
      <>
        {/* From 820 px, 6 columns. Moon: globe (4) and south pole (2) side by side.
            Mars has no polar view: the same 4-column globe, centred (columns 2 to 5) */}
        <div className="grid items-start gap-3 md2:grid-cols-6">
          <div className={cuerpo === 'luna' ? 'md2:col-span-4' : 'md2:col-span-4 md2:col-start-2'}>
            <Suspense
              fallback={
                <GlobePlaceholder
                  cuerpo={cuerpo}
                  label={t('bodyMap.global', { body: t(BODY_LABEL_KEYS[cuerpo]) })}
                  caption={globeCaption}
                />
              }
            >
              <BodyGlobe cuerpo={cuerpo} sites={data} caption={globeCaption} />
            </Suspense>
          </div>
          {cuerpo === 'luna' && (
            <div className="md2:col-span-2">
              <SouthPoleMap sites={data} />
            </div>
          )}
        </div>
        <MapLegend cuerpo={cuerpo} sites={data} />
        <SiteList sites={data} />
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-site-title font-extrabold tracking-display">
          {t('explore.title', { body: t(BODY_LABEL_KEYS[cuerpo]) })}
        </h1>
        {data && <p className="text-caption text-muted">{t('explore.count', { count: data.length })}</p>}
      </div>
      {content}
    </div>
  )
}
