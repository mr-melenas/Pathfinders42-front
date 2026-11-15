import type { components } from '@/shared/api/schema'
import { SITE_TYPE_ORDER } from '@/shared/i18n/labels'

// One item of GET /sitios, with the type generated from the OpenAPI
export type SiteSummary = components['schemas']['SitioResumen']

export type SiteGroup = {
  tipo: string // API value, as it comes
  sites: SiteSummary[]
}

// Known types in their i18n order; an unknown type goes after all of them
function rankOf(tipo: string): number {
  const index = SITE_TYPE_ORDER.indexOf(tipo)
  return index === -1 ? SITE_TYPE_ORDER.length : index
}

// Groups the sites by "tipo" and sorts both the groups and the sites (by name, in the reader's language)
export function groupSitesByType(sites: SiteSummary[], language: string): SiteGroup[] {
  const byType = new Map<string, SiteSummary[]>()
  for (const site of sites) {
    const group = byType.get(site.tipo)
    if (group) group.push(site)
    else byType.set(site.tipo, [site])
  }

  return [...byType]
    .map(([tipo, list]) => ({
      tipo,
      sites: list.toSorted((a, b) => a.nombre.localeCompare(b.nombre, language)),
    }))
    // Same rank only happens between unknown types: then alphabetically, so the order is stable
    .toSorted((a, b) => rankOf(a.tipo) - rankOf(b.tipo) || a.tipo.localeCompare(b.tipo))
}
