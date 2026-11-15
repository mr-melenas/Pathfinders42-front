import { SHAPE_CLASS, shapeOf } from '@/shared/lib/siteShapes'

// The globe library draws markers as plain HTML elements, outside React. These build them with the same classes as
// MarkerShape / SiteMarker, so the globe and the SVG maps look the same. Texts go in with textContent / title,
// never as HTML

// A site: its shape by type, in the current colour; the selected one in accent with a pulse (motion-safe only)
export function siteMarkerElement(tipo: string, name: string, selected: boolean): HTMLElement {
  const element = document.createElement('div')
  element.title = name
  element.className = `flex size-6 cursor-pointer items-center justify-center hover:text-accent ${selected ? 'z-10 text-accent' : ''}`
  if (selected) {
    const ring = document.createElement('span')
    ring.className = 'absolute inset-0 rounded-full border-2 border-accent motion-safe:animate-ping'
    element.append(ring)
  }
  const shape = shapeOf(tipo)
  const drawing = document.createElement('span')
  drawing.className = `flex shrink-0 items-center justify-center ring-1 ring-map ${SHAPE_CLASS[shape]}`
  if (shape === 'cave') {
    const dot = document.createElement('span')
    dot.className = 'size-1 rounded-full bg-current'
    drawing.append(dot)
  }
  element.append(drawing)
  return element
}

// An Earth pair: its name centred above a dot in the Earth colour. The name wraps instead of leaving the map
export function labelMarkerElement(name: string): HTMLElement {
  const element = document.createElement('div')
  element.className = 'flex flex-col items-center gap-1'
  const label = document.createElement('span')
  label.className = 'max-w-40 rounded-chip bg-map px-2 py-0.5 text-center text-caption text-foreground'
  label.textContent = name
  const dot = document.createElement('span')
  dot.className = 'size-3 shrink-0 rounded-full border-2 border-map bg-body-earth'
  element.append(label, dot)
  return element
}
