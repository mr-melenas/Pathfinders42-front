import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { components } from '@/shared/api/schema'
import { BODY_LABEL_KEYS, isBody, isSiteType } from '@/shared/i18n/labels'
import { formatArea, formatCoordinate } from '@/shared/lib/format'
import { LinkButton } from '@/shared/ui/LinkButton'
import { SiteTypeChip } from '@/shared/ui/SiteTypeChip'
import { Breadcrumbs } from '@/features/site-detail/components/Breadcrumbs'

type Site = components['schemas']['SitioDetalle']

// "propiedades" is not typed by the API: a field is only used when it really is a non-empty text
function textOf(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null
}

type SiteHeaderProps = {
  site: Site // GET /sitios/{id}, with the type generated from the OpenAPI
}

export function SiteHeader({ site }: SiteHeaderProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const { nombre, cuerpo, tipo, lat, lon, capas, propiedades } = site

  const bodyLabel = isBody(cuerpo) ? t(BODY_LABEL_KEYS[cuerpo]) : cuerpo
  const typeLabel = isSiteType(tipo) ? t(`siteType.${tipo}`) : tipo

  // "85,9948° S · 0,2358° O": the number without its sign, the hemisphere tells the side
  const coordinates =
    lat === null || lon === null
      ? null
      : `${formatCoordinate(Math.abs(lat), language)} ${t(lat < 0 ? 'coordinates.south' : 'coordinates.north')} · ` +
        `${formatCoordinate(Math.abs(lon), language)} ${t(lon < 0 ? 'coordinates.west' : 'coordinates.east')}`

  const area = typeof propiedades.area_km2 === 'number' ? propiedades.area_km2 : null

  // Rule 5.5: the source with its link when the API sends it, «Dato pendiente» when it does not
  const fuente = textOf(propiedades.fuente)
  const urlFuente = textOf(propiedades.url_fuente)
  let source: ReactNode = t('state.pending')
  if (fuente && urlFuente) source = <LinkButton href={urlFuente}>{fuente}</LinkButton>
  else if (fuente) source = fuente

  return (
    <header className="flex flex-col gap-2">
      <Breadcrumbs items={[{ label: bodyLabel }, { label: typeLabel }, { label: nombre }]} />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-site-title font-extrabold tracking-display">{nombre}</h1>
        <SiteTypeChip tipo={tipo} cuerpo={cuerpo} />
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted">
        {coordinates && <span className="font-mono tabular-nums text-foreground">{coordinates}</span>}
        {area !== null && (
          <span>
            {t('siteHeader.area')} <span className="font-mono tabular-nums text-foreground">{formatArea(area, language)}</span>
          </span>
        )}
        <span>
          {t('source.source')} {source}
        </span>
        <span>{t('siteHeader.layers', { count: capas.length })}</span>
      </p>
    </header>
  )
}
