import { useTranslation } from 'react-i18next'
import { Chip } from '@/shared/ui/Chip'
import { Icon } from '@/shared/ui/Icon'

// The two values of "detalles.verificacion" (CONTEXTO §5), as the API sends them.
// To be replaced by the generated OpenAPI type when it exists (#9).
const VARIANTS = {
  verificada: { icon: 'seal', className: 'border-foreground text-foreground' },
  candidato: { icon: 'circle', className: 'border-dashed border-muted text-muted' },
} as const

type VerificationStatus = keyof typeof VARIANTS

function isVerificationStatus(value: string): value is VerificationStatus {
  return Object.hasOwn(VARIANTS, value)
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
