export type GeoPosition = {
  lat: number
  lon: number
}

// Layers whose file lists their Earth analogues with a position (checked 15 nov: only anortosita)
export const LAYERS_WITH_POSITIONS: readonly string[] = ['anortosita']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// TEMPORARY until the API pairs carry "lat" and "lon" (B1, issue #74).
// The anortosita file has "tierra": { "<pair id>": { "lat": …, "lon": … } }. Every step is checked,
// so any other shape gives null and the map shows «position pending»: no position is ever made up
export function pairPositionFrom(layerFile: unknown, pairId: string): GeoPosition | null {
  if (!isRecord(layerFile)) return null
  const earth = layerFile.tierra
  if (!isRecord(earth)) return null
  const pair = earth[pairId]
  if (!isRecord(pair) || typeof pair.lat !== 'number' || typeof pair.lon !== 'number') return null
  return { lat: pair.lat, lon: pair.lon }
}
