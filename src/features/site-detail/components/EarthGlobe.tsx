import 'maplibre-gl/dist/maplibre-gl.css'
import { Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { GeoPosition } from '@/shared/api/pairPosition'
import { MapFrame } from '@/shared/ui/MapFrame'

// Sentinel-2 cloudless 2016 by EOX: CC BY 4.0 (later years are non-commercial only). CORS checked on 15 nov
const SATELLITE_TILES = 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg'
const PAIR_ZOOM = 7 // close enough to see the place and still some of its surroundings

// MapLibre looks for its worker next to its own file, but Vite moves files when it bundles them:
// "?url" makes Vite copy the (self-contained) worker file and gives its final URL
setWorkerUrl(workerUrl)

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// The pair's marker: its name centred above a dot in the Earth colour. The name wraps instead of leaving the map
// on narrow screens (textContent, so the name is never read as HTML)
function markerElement(name: string): HTMLElement {
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

type EarthGlobeProps = {
  pairName: string | null // the best match's name; null when there is none
  position: GeoPosition | null // null while the API does not say where the pair is (B1)
}

// 3D Earth with satellite imagery: it turns to the pair and marks it. Loaded on demand (MapLibre is heavy)
export function EarthGlobe({ pairName, position }: EarthGlobeProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  // Plain numbers as dependencies: a new position object with the same values must not rebuild the map
  const lat = position?.lat ?? null
  const lon = position?.lon ?? null

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const map = new MapLibreMap({
      container,
      style: {
        version: 8,
        projection: { type: 'globe' },
        sources: { satellite: { type: 'raster', tiles: [SATELLITE_TILES], tileSize: 256, maxzoom: 14 } },
        layers: [{ id: 'satellite', type: 'raster', source: 'satellite' }],
      },
      center: [0, 20],
      zoom: 0.8,
      attributionControl: false, // the caption below the map carries the attribution
      cooperativeGestures: true, // the page keeps scrolling: Ctrl + wheel or two fingers move the map
      locale: {
        'Map.Title': t('earthMap.label'),
        'Marker.Title': pairName ?? t('earthMap.label'),
        'NavigationControl.ZoomIn': t('earthGlobe.zoomIn'),
        'NavigationControl.ZoomOut': t('earthGlobe.zoomOut'),
        'CooperativeGesturesHandler.WindowsHelpText': t('earthGlobe.helpWindows'),
        'CooperativeGesturesHandler.MacHelpText': t('earthGlobe.helpMac'),
        'CooperativeGesturesHandler.MobileHelpText': t('earthGlobe.helpMobile'),
      },
    })
    map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')

    if (lat !== null && lon !== null && pairName !== null) {
      const lngLat: [number, number] = [lon, lat]
      // anchor "bottom": the dot (at the bottom of the marker) sits exactly on the pair's position
      new Marker({ element: markerElement(pairName), anchor: 'bottom' }).setLngLat(lngLat).addTo(map)
      // Starts with the whole globe and turns to the pair; with reduced motion it jumps there (duration 0).
      // offset puts the pair a little below the centre, so its name stays clear of the map's top-left tag
      map.once('load', () => {
        map.flyTo({ center: lngLat, zoom: PAIR_ZOOM, offset: [0, 24], duration: prefersReducedMotion() ? 0 : 3000 })
      })
    }

    // Free the WebGL context when the page changes
    return () => map.remove()
  }, [lat, lon, pairName, t])

  return (
    <MapFrame cuerpo="tierra" label={t('earthMap.label')} caption={t('earthGlobe.caption')} className="aspect-2/1">
      {/* MapLibre's CSS sets position: relative on its container, so the absolute box is a wrapper around it */}
      <div className="absolute inset-0">
        <div ref={containerRef} className="size-full" />
      </div>
      {lat === null && (
        // Same «position pending» note as the static map: nothing is placed on the globe
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-2">
          <span className="flex flex-wrap items-center justify-center gap-x-2 rounded-chip bg-map px-2.5 py-1 text-caption">
            <span aria-hidden="true" className="size-3 shrink-0 rounded-full border-2 border-dashed border-current" />
            <span className="text-foreground">{pairName ?? t('state.pending')}</span>
            <span className="text-muted">{t('earthMap.pending')}</span>
          </span>
        </div>
      )}
    </MapFrame>
  )
}
