import { useTranslation } from 'react-i18next'
import es from '@/shared/i18n/locales/es.json'
import { Chip } from '@/shared/ui/Chip'

// The known "tipo" values are the keys of the siteType texts, so the list is not written twice
type SiteType = keyof typeof es.siteType

function isSiteType(value: string): value is SiteType {
  return Object.hasOwn(es.siteType, value)
}

type SiteTypeChipProps = {
  tipo: string // the site's "tipo", as the API sends it
}

export function SiteTypeChip({ tipo }: SiteTypeChipProps) {
  const { t } = useTranslation()

  return (
    <Chip className="border-body-moon font-medium text-body-moon">
      {/* A type the front does not know yet is shown as it comes, so the data is never hidden */}
      {isSiteType(tipo) ? t(`siteType.${tipo}`) : tipo}
    </Chip>
  )
}
