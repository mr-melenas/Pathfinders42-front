import { useTranslation } from 'react-i18next'
import { Icon, type IconName } from '@/shared/ui/Icon'

type Verdict = 'pass' | 'fail' | 'null'
type VerdictLabelKey = 'verdict.pass' | 'verdict.fail' | 'verdict.null' | 'verdict.nullShort'

// null ≠ false: the API value is compared case by case (=== true / === false / === null).
// Never with if (value) or !value, which would send null and false to the same place.
function toVerdict(value: boolean | null): Verdict {
  switch (value) {
    case true:
      return 'pass'
    case false:
      return 'fail'
    case null:
      return 'null' // the layer does not decide
  }
}

const VARIANTS: Record<Verdict, { icon: IconName; labelKey: VerdictLabelKey; shortLabelKey?: VerdictLabelKey; className: string }> = {
  pass: { icon: 'check', labelKey: 'verdict.pass', className: 'border-verdict-pass bg-verdict-pass-bg text-verdict-pass' },
  fail: { icon: 'cross', labelKey: 'verdict.fail', className: 'border-verdict-fail bg-verdict-fail-bg text-verdict-fail' },
  // Dashed border and stripes, so null never looks like false
  null: {
    icon: 'dash',
    labelKey: 'verdict.null',
    shortLabelKey: 'verdict.nullShort',
    className: 'stripes-null border-dashed border-verdict-null text-verdict-null',
  },
}

type VerdictChipProps = {
  value: boolean | null // "parecido", "hay_parecido" or an item of "parecidos", exactly as the API sends it
  short?: boolean // only changes «La capa no lo decide» into «No decide»
}

// Color + icon + word, always: the color alone is not enough (red-green colour blindness)
export function VerdictChip({ value, short = false }: VerdictChipProps) {
  const { t } = useTranslation()
  const { icon, labelKey, shortLabelKey, className } = VARIANTS[toVerdict(value)]

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-chip border py-1 pr-2.5 pl-1.75 text-caption leading-tight font-semibold ${className}`}
    >
      <Icon name={icon} size={14} />
      {t(short && shortLabelKey ? shortLabelKey : labelKey)}
    </span>
  )
}
