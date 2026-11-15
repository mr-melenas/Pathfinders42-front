import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAnalogues } from '@/shared/api/queries'
import { AnalogueSheet } from '@/features/site-detail/components/AnalogueSheet'

type AnaloguesPanelProps = {
  siteId: string
}

// The site's Earth analogues (suitable ones first): pick one to see its sheet
export function AnaloguesPanel({ siteId }: AnaloguesPanelProps) {
  const { t } = useTranslation()
  const headingId = useId()
  const { data: analogues } = useAnalogues(siteId, 5)
  const [chosenId, setChosenId] = useState<string | null>(null)

  if (!analogues || analogues.length === 0) return null
  const chosen = analogues.find((analogue) => analogue.tierra_id === chosenId) ?? analogues[0]

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3 rounded-card bg-surface p-3.5">
      <h2 id={headingId} className="font-display text-panel-title font-extrabold tracking-display">
        {t('analogues.title')}
      </h2>
      <div role="group" aria-label={t('analogues.choose')} className="flex flex-wrap gap-1.5">
        {analogues.map((analogue) => (
          <button
            key={analogue.tierra_id}
            type="button"
            aria-pressed={analogue.tierra_id === chosen.tierra_id}
            onClick={() => setChosenId(analogue.tierra_id)}
            className="cursor-pointer rounded-chip border border-muted px-2.5 py-1 text-caption text-muted hover:text-foreground aria-pressed:bg-surface-2 aria-pressed:font-semibold aria-pressed:text-foreground"
          >
            {analogue.tierra_nombre}
          </button>
        ))}
      </div>
      <AnalogueSheet siteId={siteId} earthId={chosen.tierra_id} />
    </section>
  )
}
