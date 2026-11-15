import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/layout/AppLayout'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { ExploreRoute, SiteDetailRoute } from '@/app/routes'
import { EarthLimitsPage } from '@/features/earth-limits'
import { LandingPage } from '@/features/landing'

// Routes from docs/arquitectura-pantallas.md
export const router = createBrowserRouter([
  // The landing has its own header, so it lives outside the explorer's layout
  { path: '/', Component: LandingPage },
  {
    Component: AppLayout, // no path: a layout route only adds the common frame; pages render in its <Outlet />
    children: [
      { path: 'limites-tierra', Component: EarthLimitsPage },
      { path: ':cuerpo', Component: ExploreRoute },
      { path: ':cuerpo/:siteId', Component: SiteDetailRoute },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
