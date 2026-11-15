import { isSiteType, type Body, type SiteType } from '@/shared/i18n/labels'

export type Shape = 'region' | 'landing' | 'cave' | 'unknown'

// The shape tells the type (sistema-visual §6.3, SiteMarker). Every known type is listed,
// so a new type in the translation files is a TypeScript error here until it gets a shape
const SHAPE_BY_TYPE: Record<SiteType, Shape> = {
  region_aterrizaje_artemis: 'region',
  exploration_zone: 'region',
  aterrizaje_tripulado: 'landing',
  aterrizaje_robotico: 'landing',
  aterrizaje_planificado: 'landing',
  cueva_luna: 'cave',
  cueva_marte: 'cave',
}

// A type we do not know yet still gets drawn, as a plain dot
export function shapeOf(tipo: string): Shape {
  return isSiteType(tipo) ? SHAPE_BY_TYPE[tipo] : 'unknown'
}

// Order of the shapes in the legend
export const SHAPE_ORDER: readonly Shape[] = ['region', 'landing', 'cave', 'unknown']

// Marker colour of each body: Mars has no colour of its own yet (F4.8), so it uses the text colour
export const BODY_COLOR: Record<Body, string> = { luna: 'text-body-moon', marte: 'text-foreground' }
