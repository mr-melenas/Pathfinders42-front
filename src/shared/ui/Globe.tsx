import 'maplibre-gl/dist/maplibre-gl.css'
import { Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Body } from '@/shared/i18n/labels'
import { MapFrame } from '@/shared/ui/MapFrame'

// MapLibre looks for its worker next to its own file, but Vite moves files when it bundles them:
// "?url" makes Vite copy the (self-contained) worker file and gives its final URL
setWorkerUrl(workerUrl)

export type GlobeImagery = {
  tiles: string // Web Mercator {z}/{x}/{y} URL template
  maxzoom: number // last zoom level with real detail; further in, MapLibre enlarges that level
}

export type GlobeMarker = {
  id: string
  lon: number
  lat: number
  element: () => HTMLElement // built when the map is (globeMarkers.ts)
  anchor?: 'center' | 'bottom' // which point of the element sits on the position
}

type GlobeProps = {
  cuerpo: Body | 'tierra' // frame and marker colour
  imagery: GlobeImagery
  label: string // top-left tag, also the map's accessible name
  caption: string
  markers: GlobeMarker[] // keep the array stable (useMemo): a new array rebuilds the map
  focus?: { lon: number; lat: number; zoom: number } | null // the camera turns here once the map has loaded
  onSelect?: (id: string) => void // a marker was clicked
  overlay?: ReactNode // drawn over the globe, e.g. «position pending»
  initialZoom?: number // how big the whole globe looks before any focus
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 3D globe (MapLibre, globe projection) for the Earth, the Moon or Mars. Loaded on demand: MapLibre is heavy.
// Web Mercator tiles stop at ±85.05°: sites closer to a pole cannot be drawn here (see the south pole view)
export function Globe({
  cuerpo,
  imagery,
  label,
  caption,
  markers,
  focus = null,
  onSelect,
  overlay,
  initialZoom = 0.8,
}: GlobeProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  // Plain values as dependencies: a new object with the same values must not rebuild the map
  const focusLon = focus?.lon ?? null
  const focusLat = focus?.lat ?? null
  const focusZoom = focus?.zoom ?? null

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const map = new MapLibreMap({
      container,
      style: {
        version: 8,
        projection: { type: 'globe' },
        sources: { imagery: { type: 'raster', tiles: [imagery.tiles], tileSize: 256, maxzoom: imagery.maxzoom } },
        layers: [{ id: 'imagery', type: 'raster', source: 'imagery' }],
      },
      center: [0, 20],
      zoom: initialZoom,
      maxZoom: imagery.maxzoom + 2,
      attributionControl: false, // the caption below the map carries the attribution
      cooperativeGestures: true, // the page keeps scrolling: Ctrl + wheel or two fingers move the map
      locale: {
        'Map.Title': label,
        'NavigationControl.ZoomIn': t('globe.zoomIn'),
        'NavigationControl.ZoomOut': t('globe.zoomOut'),
        'CooperativeGesturesHandler.WindowsHelpText': t('globe.helpWindows'),
        'CooperativeGesturesHandler.MacHelpText': t('globe.helpMac'),
        'CooperativeGesturesHandler.MobileHelpText': t('globe.helpMobile'),
      },
    })
    map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')

    for (const marker of markers) {
      const element = marker.element()
      if (onSelect) element.addEventListener('click', () => onSelect(marker.id))
      new Marker({ element, anchor: marker.anchor ?? 'center' }).setLngLat([marker.lon, marker.lat]).addTo(map)
      // Mouse only, like the SVG maps: keyboard and screen reader users get the same places as text on the page
      element.setAttribute('tabindex', '-1')
      element.setAttribute('aria-hidden', 'true')
    }

    if (focusLon !== null && focusLat !== null && focusZoom !== null) {
      // Starts with the whole globe and turns to the place; with reduced motion it jumps there (duration 0).
      // offset puts the place a little below the centre, so a label stays clear of the map's top-left tag
      map.once('load', () => {
        map.flyTo({
          center: [focusLon, focusLat],
          zoom: focusZoom,
          offset: [0, 24],
          duration: prefersReducedMotion() ? 0 : 3000,
        })
      })
    }

    // Free the WebGL context when the page changes
    return () => map.remove()
  }, [imagery.tiles, imagery.maxzoom, label, markers, focusLon, focusLat, focusZoom, onSelect, initialZoom, t])

  return (
    <MapFrame cuerpo={cuerpo} label={label} caption={caption} className="aspect-2/1">
      {/* MapLibre's CSS sets position: relative on its container, so the absolute box is a wrapper around it */}
      <div className="absolute inset-0">
        <div ref={containerRef} className="size-full" />
      </div>
      {overlay}
    </MapFrame>
  )
}
