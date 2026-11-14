import { lazy, Suspense } from 'react'
import { RouterProvider } from 'react-router/dom'
import { router } from '@/app/router'

// Dev-only style guide: Vite sets DEV to false in production builds,
// so this branch and its dynamic import are removed from the bundle
const StyleGuide = import.meta.env.DEV
  ? lazy(() => import('@/app/dev/StyleGuide').then((module) => ({ default: module.StyleGuide })))
  : null

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* The style guide stays outside the router: it does not need any route */}
      {StyleGuide && (
        <Suspense fallback={null}>
          <StyleGuide />
        </Suspense>
      )}
    </>
  )
}
