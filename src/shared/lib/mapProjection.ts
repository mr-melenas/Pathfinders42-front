// Where a site goes on each map, as fractions of the map's size (0 = left/top, 1 = right/bottom).
// Pure functions with no React, ready for the tests in #23.

// The fields a map needs from a site. Both GET /sitios items and GET /sitios/{id} have them,
// so the maps accept either without depending on a feature
export type MapSite = {
  id: string
  nombre: string
  tipo: string
  lat: number | null
  lon: number | null
}

export type MapPoint = {
  x: number
  y: number
}

// South pole view: centre = the pole, edge = 80° S (as in the final design)
export const POLAR_EDGE_LAT = -80

// Azimuthal view seen from below the pole: 0° at the top and 90° E to the right, as in Antarctica maps.
// null when the site is north of the edge, so it is not drawn on this view
export function toSouthPolar(lon: number, lat: number): MapPoint | null {
  const radius = (90 + lat) / (90 + POLAR_EDGE_LAT) // 0 at the pole, 1 at the edge
  if (radius > 1) return null

  const angle = (lon * Math.PI) / 180
  // From the -1…1 circle to 0…1, with y growing downwards as on screen
  return { x: 0.5 + (radius * Math.sin(angle)) / 2, y: 0.5 - (radius * Math.cos(angle)) / 2 }
}
