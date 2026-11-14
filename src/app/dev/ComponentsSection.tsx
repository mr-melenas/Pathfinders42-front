import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import es from '@/shared/i18n/locales/es.json'
import { Icon, type IconName } from '@/shared/ui/Icon'
import { Logo } from '@/shared/ui/Logo'
import { SegmentedToggle } from '@/shared/ui/SegmentedToggle'
import { SiteTypeChip } from '@/shared/ui/SiteTypeChip'
import { VerdictChip } from '@/shared/ui/VerdictChip'
import { VerificationChip } from '@/shared/ui/VerificationChip'

// The 3 possible API values; each one is shown in its normal and short version
const VERDICT_VALUES = [true, false, null] as const

// Each icon in the color it takes where it is used (the icon inherits the text color)
const ICON_SAMPLES: { name: IconName; className: string }[] = [
  { name: 'check', className: 'text-verdict-pass' },
  { name: 'cross', className: 'text-verdict-fail' },
  { name: 'dash', className: 'text-verdict-null' },
  { name: 'seal', className: 'text-foreground' },
  { name: 'circle', className: 'text-muted' },
]

// Every shared component with its variants, so they can be reviewed at a glance
export function ComponentsSection() {
  const { t } = useTranslation()
  // Values are the API's "cuerpo" values, used as they come from the API
  const [body, setBody] = useState('luna')

  return (
    <section aria-labelledby="style-guide-components" className="flex flex-col gap-3">
      <h3 id="style-guide-components" className="font-display text-card-title font-bold">
        Components
      </h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        <li className="flex flex-col items-start gap-1.5 rounded-card bg-surface p-3">
          <Logo />
          <code className="font-mono text-data">Logo</code>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-card bg-surface p-3">
          <SegmentedToggle
            label={t('toggle.body')}
            options={[
              { value: 'luna', label: t('body.moon') },
              { value: 'marte', label: t('body.mars') },
            ]}
            value={body}
            onChange={setBody}
          />
          <code className="font-mono text-data">SegmentedToggle</code>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-card bg-surface p-3 sm:col-span-2">
          <ul className="flex flex-wrap gap-5">
            {ICON_SAMPLES.map(({ name, className }) => (
              <li key={name} className={`flex flex-col items-center gap-1 ${className}`}>
                <span className="flex items-center gap-2">
                  <Icon name={name} size={14} />
                  <Icon name={name} />
                </span>
                <code className="font-mono text-data text-muted">{name}</code>
              </li>
            ))}
          </ul>
          <code className="font-mono text-data">Icon · 14 / 16 px</code>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-card bg-surface p-3 sm:col-span-2">
          <ul className="flex flex-col gap-2">
            {VERDICT_VALUES.map((value) => (
              <li key={String(value)} className="flex flex-wrap items-center gap-2">
                <code className="w-12 font-mono text-data text-muted">{String(value)}</code>
                <VerdictChip value={value} />
                <VerdictChip value={value} short />
              </li>
            ))}
          </ul>
          <code className="font-mono text-data">VerdictChip · value · short</code>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-card bg-surface p-3 sm:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <VerificationChip status="verificada" />
            <VerificationChip status="candidato" />
            <code className="font-mono text-data text-muted">null → renders nothing:</code>
            <VerificationChip status={null} />
          </div>
          <code className="font-mono text-data">VerificationChip · verificada / candidato / null</code>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-card bg-surface p-3 sm:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            {Object.keys(es.siteType).map((tipo) => (
              <SiteTypeChip key={tipo} tipo={tipo} />
            ))}
            <code className="font-mono text-data text-muted">unknown tipo, shown as it comes:</code>
            <SiteTypeChip tipo="nuevo_tipo" />
          </div>
          <code className="font-mono text-data">SiteTypeChip · the 7 tipos + an unknown one</code>
        </li>
      </ul>
    </section>
  )
}
