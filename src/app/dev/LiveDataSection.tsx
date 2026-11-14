import { LiveSite } from '@/app/dev/LiveSite'

// Real sites of the API: one with every field (Malapert) and one without area or source (Marius Hills Pit)
const SAMPLE_SITE_IDS = ['artemis-malapert-massif', 'cueva-luna-marius-hills-pit']

export function LiveDataSection() {
  return (
    <section aria-labelledby="style-guide-live" className="flex flex-col gap-3">
      <h3 id="style-guide-live" className="font-display text-card-title font-bold">
        Live data · <code className="font-mono text-data">useSite</code>
      </h3>
      {SAMPLE_SITE_IDS.map((siteId) => (
        <LiveSite key={siteId} siteId={siteId} />
      ))}
    </section>
  )
}
