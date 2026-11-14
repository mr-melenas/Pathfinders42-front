import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/client'

// Retrying only helps when the problem may go away: no connection (0) or an API without data yet (503).
// A 404 or a 422 would fail the same way again, so they are not retried.
const RETRYABLE_STATUSES = new Set([0, 503])
const MAX_RETRIES = 1

export function shouldRetry(failureCount: number, error: unknown): boolean {
  return error instanceof ApiError && RETRYABLE_STATUSES.has(error.status) && failureCount < MAX_RETRIES
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      // The API data is frozen (CONTEXTO §2): it stays fresh for 5 minutes instead of being refetched every time
      staleTime: 5 * 60 * 1000,
    },
  },
})
