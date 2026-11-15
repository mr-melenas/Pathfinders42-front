import { useTranslation } from 'react-i18next'
import { isBody, isSiteType, type Body } from '@/shared/i18n/labels'
import { Chip } from '@/shared/ui/Chip'

// The chip takes the colour of the body the site is on
const BODY_CHIP_COLOR: Record<Body, string> = {
  luna: 'border-body-moon text-body-moon',
  marte: 'border-body-mars text-body-mars',
}

type SiteTypeChipProps = {
  tipo: string // the site's "tipo", as the API sends it
  cuerpo: string // the site's "cuerpo", as the API sends it
}

export function SiteTypeChip({ tipo, cuerpo }: SiteTypeChipProps) {
  const { t } = useTranslation()
  // A body the front does not know yet keeps the Moon's colour, the most neutral one
  const color = isBody(cuerpo) ? BODY_CHIP_COLOR[cuerpo] : BODY_CHIP_COLOR.luna

  return (
    <Chip className={`font-medium ${color}`}>
      {/* A type the front does not know yet is shown as it comes, so the data is never hidden */}
      {isSiteType(tipo) ? t(`siteType.${tipo}`) : tipo}
    </Chip>
  )
}
