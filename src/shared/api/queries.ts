import { useQuery } from '@tanstack/react-query'
import { getPairs, getSite, getSites, getSitesGeojson, getUseMatches } from '@/shared/api/client'
import type { components } from '@/shared/api/schema'

type Layer = components['schemas']['ResumenCapa']['capa']

// Query keys in one place, from general to specific: everything about one site starts with ['site', id].
// A key holds every value that changes the answer, so each combination is cached on its own.
export const queryKeys = {
  sites: (cuerpo?: string) => ['sites', { cuerpo }] as const,
  sitesGeojson: () => ['sites', 'geojson'] as const,
  site: (siteId: string) => ['site', siteId] as const,
  pairs: (siteId: string, capa?: Layer) => ['site', siteId, 'pairs', { capa }] as const,
  useMatches: (siteId: string, uso: string, n: number) => ['site', siteId, 'uses', uso, { n }] as const,
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

export function useUseMatches(siteId: string, uso: string, n: number) {
  return useQuery({ queryKey: queryKeys.useMatches(siteId, uso, n), queryFn: () => getUseMatches(uso, siteId, { n }) })
}