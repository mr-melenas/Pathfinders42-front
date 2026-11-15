import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

// Shown inside the common layout for any unknown URL (and for a "cuerpo" that is not luna/marte)
export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="font-display text-site-title font-extrabold tracking-display">{t('notFound.title')}</h1>
      <p className="text-muted">{t('notFound.text')}</p>
      {/* Same look as LinkButton, but a router Link: it navigates without reloading the page */}
      <Link to="/luna"className="text-horizon underline underline-offset-3 hover:text-foreground">
        {t('notFound.back')}
      </Link>
    </div>
  )
}
