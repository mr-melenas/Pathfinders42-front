import { lazy, Suspense, useState } from 'react'
import { AppHeader } from '@/app/layout/AppHeader'

// Dev-only style guide: Vite sets DEV to false in production builds,
// so this branch and its dynamic import are removed from the bundle
const StyleGuide = import.meta.env.DEV
  ? lazy(() => import('@/app/dev/StyleGuide').then((module) => ({ default: module.StyleGuide })))
  : null

export function App() {
  // Selected body, with the API's "cuerpo" values; it will move to the URL with the routes (#13)
  const [body, setBody] = useState('luna')

  return (
    <>
      <div className="mx-auto flex min-h-screen w-full max-w-content flex-col gap-4 p-4">
        <AppHeader body={body} onBodyChange={setBody} />
        <main className="flex flex-1 items-center justify-center">
          <h1 className="font-display text-site-title font-extrabold tracking-display">Pathfinders42</h1>
        </main>
      </div>
      {StyleGuide && (
        <Suspense fallback={null}>
          <StyleGuide />
        </Suspense>
      )}
    </>
  )
}
