import { createBrowserRouter, redirect } from 'react-router'
import { AppLayout } from '@/app/layout/AppLayout'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { ExploreRoute, SiteDetailRoute } from '@/app/routes'
import { EarthLimitsPage } from '@/features/earth-limits'

// Routes from docs/arquitectura-pantallas.md; every page renders inside AppLayout's <Outlet />
export const router = createBrowserRouter([
  {
    Component: AppLayout, // no path: a layout route only adds the common frame
    children: [
      { index: true, loader: () => redirect('/luna') }, // "/" has no page of its own
      { path: 'limites-tierra', Component: EarthLimitsPage },
      { path: ':cuerpo', Component: ExploreRoute },
      { path: ':cuerpo/:siteId', Component: SiteDetailRoute },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
