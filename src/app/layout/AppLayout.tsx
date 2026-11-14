import { Outlet } from 'react-router'
import { AppHeader } from '@/app/layout/AppHeader'

// Common frame of every page: the router renders the matching child page in <Outlet />
export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-content flex-col gap-4 p-4">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
