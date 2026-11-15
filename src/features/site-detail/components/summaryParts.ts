import type { components } from '@/shared/api/schema'

type Site = components['schemas']['SitioDetalle']
type UseMatch = components['schemas']['ParejaUso']

// A layer of the site ("resumen") or of a use ("funciona"): both lists name the same layers,
// except the use's "forma_cueva", which is the site's "cuevas"
export type SummaryLayer = Site['resumen'][number]['capa'] | UseMatch['funciona'][number]

function sameLayer(layer: SummaryLayer): SummaryLayer {
  return layer === 'forma_cueva' ? 'cuevas' : layer
}

export type PlainSummaryParts = {
  match: { pairName: string; layers: SummaryLayer[] } | null // «{site} resembles {pair} in {layers}»
  fails: SummaryLayer[] // «no place on Earth resembles it in {layers}»
  climate: { pairName: string; gapC: number } | null // «it is {gap} °C colder/warmer on average than {pair}»
}

// What the plain-language sentence can say, from the API data only. null when there is nothing to say
export function plainSummaryParts(site: Site, best: UseMatch | null): PlainSummaryParts | null {
  // First sentence: one single Earth place and the layers that work for IT (never mixing pairs)
  const match = best && best.funciona.length > 0 ? { pairName: best.tierra_nombre, layers: best.funciona } : null

  // Second sentence: the layers where the site fails against the whole Earth (=== false: null is not a failure),
  // leaving out those the first sentence says work, so the two sentences never contradict each other
  const matched = new Set(match?.layers.map(sameLayer))
  const fails = site.resumen
    .filter((layer) => layer.hay_parecido === false && !matched.has(sameLayer(layer.capa)))
    .map((layer) => layer.capa)

  // Temperature detail, only when climate is one of those failures and the API gives the gap.
  // brecha_ts_media is site − Earth in °C: negative = the site is colder (confirmed by the back, 15 nov)
  const climate = site.resumen.find((layer) => layer.capa === 'clima')
  const gap = climate?.mejor?.detalles.brecha_ts_media
  const climatePart =
    fails.includes('clima') && climate?.mejor && typeof gap === 'number' && gap !== 0
      ? { pairName: climate.mejor.nombre, gapC: gap }
      : null

  if (match === null && fails.length === 0) return null
  return { match, fails, climate: climatePart }
}
