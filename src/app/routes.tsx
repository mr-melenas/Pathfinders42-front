import { useParams } from 'react-router'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { ExplorePage } from '@/features/explore'
import { SiteDetailPage } from '@/features/site-detail'
import { isBody } from '@/shared/i18n/labels'

// The pages do not know the router: these adapters read the URL, check :cuerpo and pass plain props

export function ExploreRoute() {
  const { cuerpo = '' } = useParams()
  return isBody(cuerpo) ? <ExplorePage cuerpo={cuerpo} /> : <NotFoundPage />
}

export function SiteDetailRoute() {
  const { cuerpo = '', siteId = '' } = useParams()
  return isBody(cuerpo) ? <SiteDetailPage siteId={siteId} /> : <NotFoundPage />
}
