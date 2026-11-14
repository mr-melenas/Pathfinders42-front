import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type EmptyStateProps = {
  children?: ReactNode // the message; «No hay resultados» when not given
}

// Nothing to show: muted italic text, never a filler number (sistema-visual §6)
export function EmptyState({ children }: EmptyStateProps) {
  const { t } = useTranslation()
  return <p className="text-caption text-muted italic">{children ?? t('state.empty')}</p>
}
