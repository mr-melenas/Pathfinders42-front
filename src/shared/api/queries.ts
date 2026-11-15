import { skipToken, useQuery } from '@tanstack/react-query'
import { getLayerFile, getPairs, getSite, getSites, getSitesGeojson } from '@/shared/api/client'
import { LAYERS_WITH_POSITIONS, pairPositionFrom } from '@/shared/api/pairPosition'
import type { components } from '@/shared/api/schema'

type Layer = components['schemas']['ResumenCapa']['capa']

// Query keys in one place, from general to specific: everything about one site starts with ['site', id].
// A key holds every value that changes the answer, so each combination is cached on its own.
export const queryKeys = {
  sites: (cuerpo?: string) => ['sites', { cuerpo }] as const,
  sitesGeojson: () => ['sites', 'geojson'] as const,
  site: (siteId: string) => ['site', siteId] as const,
  pairs: (siteId: string, capa?: Layer) => ['site', siteId, 'pairs', { capa }] as const,
  layerFile: (capa: string) => ['layer', capa] as const,
}

export function useSites(cuerpo?: string) {
  return useQuery({ queryKey: queryKeys.sites(cuerpo), queryFn: () => getSites({ cuerpo }) })
}

export function useSitesGeojson() {
  return useQuery({ queryKey: queryKeys.sitesGeojson(), queryFn: getSitesGeojson })
}

export function useSite(siteId: string) {
  return useQuery({ queryKey: queryKeys.site(siteId), queryFn: () => getSite(siteId) })
}

export function usePairs(siteId: string, capa?: Layer) {
  return useQuery({ queryKey: queryKeys.pairs(siteId, capa), queryFn: () => getPairs(siteId, { capa }) })
}

// Where a pair is on Earth, or null when the data does not say. TEMPORARY until B1 (see pairPosition.ts)
export function usePairPosition(capa: string | null, pairId: string | null) {
  const canKnow = capa !== null && pairId !== null && LAYERS_WITH_POSITIONS.includes(capa)
  return useQuery({
    queryKey: queryKeys.layerFile(capa ?? 'none'),
    // skipToken: no request at all for layers without positions (the climate file alone is 150 KB)
    queryFn: canKnow ? () => getLayerFile(capa) : skipToken,
    staleTime: Infinity, // the file only changes when the data is exported again
    select: (file) => (pairId === null ? null : pairPositionFrom(file, pairId)),
  })
}
