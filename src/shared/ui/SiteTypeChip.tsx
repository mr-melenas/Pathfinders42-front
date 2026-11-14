import { useTranslation } from 'react-i18next'
import { isSiteType } from '@/shared/i18n/labels'
import { Chip } from '@/shared/ui/Chip'

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
