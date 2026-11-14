import type { components } from '@/shared/api/schema'

// One item of "resumen" from GET /sitios/{id}, with the type generated from the OpenAPI
export type LayerSummary = components['schemas']['ResumenCapa']

// Distance of the layer's best pair; null when the API sends no pair or no distance for it
function distanceOf(layer: LayerSummary): number | null {
  return layer.mejor?.distancia ?? null
}

// The layer shown as «Mejor pareja»: the closest one among the layers that work (hay_parecido === true);
// if none works, the closest one among all. null when no layer has a distance, so nothing is made up
export function pickBestLayer(resumen: LayerSummary[]): LayerSummary | null {
  const working = resumen.filter((layer) => layer.hay_parecido === true && distanceOf(layer) !== null)
  const candidates = working.length > 0 ? working : resumen

  let best: LayerSummary | null = null
  let bestDistance = Infinity
  for (const layer of candidates) {
    const distance = distanceOf(layer)
    // Strict "<": on a tie the first layer wins, so the API's order decides
    if (distance !== null && distance < bestDistance) {
      best = layer
      bestDistance = distance
    }
  }
  return best
}
