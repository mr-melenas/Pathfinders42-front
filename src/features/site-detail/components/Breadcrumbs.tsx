import { useTranslation } from 'react-i18next'

export type Crumb = {
  label: string
  href?: string // a link when given; plain text until there is a page to go to
}

type BreadcrumbsProps = {
  items: Crumb[] // from the top level to the current page
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('breadcrumbs.label')}>
      <ol className="flex flex-wrap items-center gap-x-1.5 text-caption text-muted">
        {items.map(({ label, href }, index) => {
          const isCurrent = index === items.length - 1
          let content = <span>{label}</span>
          if (isCurrent) {
            content = <span aria-current="page" className="text-foreground">{label}</span>
          } else if (href) {
            content = <a href={href} className="underline underline-offset-3 hover:text-foreground">{label}</a>
          }
          return (
            <li key={`${index}-${label}`} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden="true">›</span>}
              {content}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
