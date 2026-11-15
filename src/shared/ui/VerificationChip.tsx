import { useTranslation } from 'react-i18next'
import { isVerificationStatus, type VerificationStatus } from '@/shared/i18n/labels'
import { Chip } from '@/shared/ui/Chip'
import { Icon, type IconName } from '@/shared/ui/Icon'

// One look per value of "detalles.verificacion" (CONTEXTO §5), as the API sends them
const VARIANTS: Record<VerificationStatus, { icon: IconName; className: string }> = {
  verificada: { icon: 'seal', className: 'border-foreground text-foreground' },
  // Every status that is not «verificada» looks unconfirmed: dashed border and muted colour, the word tells which
  candidato: { icon: 'circle', className: 'border-dashed border-muted text-muted' },
  pendiente: { icon: 'circle', className: 'border-dashed border-muted text-muted' },
  'hipótesis': { icon: 'circle', className: 'border-dashed border-muted text-muted' },
}

type VerificationChipProps = {
  status?: string | null // "detalles.verificacion": some layers do not send it
}

export function VerificationChip({ status }: VerificationChipProps) {
  const { t } = useTranslation()

  // No (known) verification from the API: show nothing, never assume "candidato"
  if (typeof status !== 'string' || !isVerificationStatus(status)) return null

  const { icon, className } = VARIANTS[status]
  return (
    <Chip className={`font-medium ${className}`}>
      <Icon name={icon} size={14} />
      {t(`verification.${status}`)}
    </Chip>
  )
}
