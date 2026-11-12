import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/shared/ui/Logo'
import { SegmentedToggle } from '@/shared/ui/SegmentedToggle'

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
      </ul>
    </section>
  )
}
