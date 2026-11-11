import { lazy, Suspense } from 'react'

// Dev-only style guide: Vite sets DEV to false in production builds,
// so this branch and its dynamic import are removed from the bundle
const StyleGuide = import.meta.env.DEV
  ? lazy(() => import('@/app/dev/StyleGuide').then((module) => ({ default: module.StyleGuide })))
  : null

export function App() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="font-display text-site-title font-extrabold tracking-display">Pathfinders42</h1>
      </main>
      {StyleGuide && (
        <Suspense fallback={null}>
          <StyleGuide />
        </Suspense>
      )}
    </>
  )
}
