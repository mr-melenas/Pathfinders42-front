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

// The drawing of each shape, in the current text colour: MarkerShape (React) and the globe markers (plain DOM) use it
export const SHAPE_CLASS: Record<Shape, string> = {
  region: 'size-3 border-2 border-current bg-current/18', // square with an 18 % fill
  landing: 'size-2.5 rotate-45 bg-current', // diamond
  cave: 'size-3 rounded-full border-2 border-current', // ring, with a dot inside
  unknown: 'size-2.5 rounded-full bg-current', // plain dot
}

// Order of the shapes in the legend
export const SHAPE_ORDER: readonly Shape[] = ['region', 'landing', 'cave', 'unknown']

// Marker colour of each body (sistema-visual §2.2)
export const BODY_COLOR: Record<Body, string> = { luna: 'text-body-moon', marte: 'text-body-mars' }

// Frame colour of every map, the Earth included (sistema-visual §2.2)
export const MAP_COLOR: Record<Body | 'tierra', string> = { ...BODY_COLOR, tierra: 'text-body-earth' }
