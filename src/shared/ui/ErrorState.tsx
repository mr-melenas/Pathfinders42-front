import { useTranslation } from 'react-i18next'
import { ApiError } from '@/shared/api/client'

type ErrorKey = 'error.offline' | 'error.notFound' | 'error.invalid' | 'error.unavailable' | 'state.error'

// One message per API status (CONTEXTO §6); status 0 means the API could not be reached
function messageKey(error: unknown): ErrorKey {
  if (!(error instanceof ApiError)) return 'state.error'
  switch (error.status) {
    case 0:
      return 'error.offline'
    case 404:
      return 'error.notFound'
    case 422:
      return 'error.invalid'
    case 503:
      return 'error.unavailable'
    default:
      return 'state.error'
  }
}

type ErrorStateProps = {
  error: unknown // whatever the API call threw: usually an ApiError
  onRetry?: () => void
}

// Plain foreground text, never the «Falla» color: an error is not a verdict
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-card bg-surface p-3">
      <p>{t(messageKey(error))}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-chip border border-accent px-3 py-1 text-caption font-semibold text-accent hover:bg-surface-2"
        >
          {t('state.retry')}
        </button>
      )}
    </div>
  )
}
