import createClient from 'openapi-fetch'
import type { paths } from '@/shared/api/schema'

// VITE_API_URL follows the team's convention and ends in "/api/v1" (CONTEXTO §7),
// but the generated paths already start with "/api/v1": the client only needs the server part
const DEFAULT_API_URL = 'http://localhost:8000/api/v1'
const baseUrl = (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/api\/v1\/?$/, '')

const client = createClient<paths>({ baseUrl })

// What ErrorState needs to choose its message
export class ApiError extends Error {
  readonly status: number // HTTP status (404, 422, 503…), or 0 when the API could not be reached
  readonly detail: string | null // the API's {"detail": "..."} when it is a text

  constructor(status: number, detail: string | null) {
    super(detail ?? `API error ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

function detailOf(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'detail' in error && typeof error.detail === 'string') {
    return error.detail
  }
  return null // a 422 sends a list of validation errors, not a text
}

// Turns an openapi-fetch call into its data, or throws an ApiError
async function unwrap<T>(request: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  const result = await request.catch(() => {
    throw new ApiError(0, null) // no connection, API down or blocked by CORS
  })
  if (result.data === undefined) throw new ApiError(result.response.status, detailOf(result.error))
  return result.data
}

// Query parameters exactly as the contract defines them
type SitesQuery = NonNullable<paths['/api/v1/sitios']['get']['parameters']['query']>
type PairsQuery = NonNullable<paths['/api/v1/sitios/{sitio_id}/parejas']['get']['parameters']['query']>
type UseMatchesQuery = NonNullable<paths['/api/v1/usos/{uso}/sitios/{sitio_id}']['get']['parameters']['query']>
type AnaloguesQuery = NonNullable<paths['/api/v1/analogos/{sitio_id}']['get']['parameters']['query']>

export function getHealth() {
  return unwrap(client.GET('/api/v1/health'))
}

export function getSites(query?: SitesQuery) {
  return unwrap(client.GET('/api/v1/sitios', { params: { query } }))
}

export function getSitesGeojson() {
  return unwrap(client.GET('/api/v1/sitios/geojson'))
}

export function getSite(siteId: string) {
  return unwrap(client.GET('/api/v1/sitios/{sitio_id}', { params: { path: { sitio_id: siteId } } }))
}

export function getPairs(siteId: string, query?: PairsQuery) {
  return unwrap(client.GET('/api/v1/sitios/{sitio_id}/parejas', { params: { path: { sitio_id: siteId }, query } }))
}

// Earth places for a site and a mission use, best first; each one says which layers work and fail for THAT place
export function getUseMatches(uso: string, siteId: string, query?: UseMatchesQuery) {
  return unwrap(client.GET('/api/v1/usos/{uso}/sitios/{sitio_id}', { params: { path: { uso, sitio_id: siteId }, query } }))
}

// The site's Earth analogues, suitable ones first, each with a one-line summary in es/en
export function getAnalogues(siteId: string, query?: AnaloguesQuery) {
  return unwrap(client.GET('/api/v1/analogos/{sitio_id}', { params: { path: { sitio_id: siteId }, query } }))
}

// One analogue's sheet: pros, cons, unmeasured layers and Earth limits, precomputed by the back in es/en
export function getAnalogue(siteId: string, earthId: string) {
  return unwrap(
    client.GET('/api/v1/analogos/{sitio_id}/{tierra_id}', { params: { path: { sitio_id: siteId, tierra_id: earthId } } }),
  )
}