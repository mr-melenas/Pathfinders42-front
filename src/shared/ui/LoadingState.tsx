import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

// Placeholder with the size of the content that is coming (set it with className, e.g. "h-40"),
// so the page does not jump when the data arrives
export function LoadingState({ className = '', ...props }: ComponentProps<'div'>) {
  const { t } = useTranslation()

  return (
    <div role="status" aria-busy="true" className={`rounded-card bg-surface-2 motion-safe:animate-pulse ${className}`} {...props}>
      {/* No visible text (sistema-visual §6), but screen readers still hear that it is loading */}
      <span className="sr-only">{t('state.loading')}</span>
    </div>
  )
}
