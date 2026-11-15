import { useTranslation } from 'react-i18next'
import { MapFrame } from '@/shared/ui/MapFrame'

// The whole Earth from NASA GIBS (Blue Marble), equirectangular like the Trek images: one image, CORS open (checked 15 nov)
const BLUE_MARBLE =
  'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0' +
  '&LAYERS=BlueMarble_ShadedRelief_Bathymetry&STYLES=&CRS=EPSG:4326&BBOX=-90,-180,90,180&WIDTH=1024&HEIGHT=512&FORMAT=image/jpeg'

type EarthMapProps = {
  pairName: string | null // the best match's name; null when there is none
}

// The Earth with the pair. The API does not send the pair's position yet (B1), so it is shown as «position pending»
export function EarthMap({ pairName }: EarthMapProps) {
  const { t } = useTranslation()

  return (
    <MapFrame cuerpo="tierra" label={t('earthMap.label')} caption={t('earthMap.caption')} className="aspect-2/1">
      <img src={BLUE_MARBLE} alt="" aria-hidden="true" className="block size-full" />
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <span className="flex flex-wrap items-center justify-center gap-x-2 rounded-chip bg-map px-2.5 py-1 text-caption">
          {/* Dashed circle: the pending-position marker of sistema-visual §6.3 */}
          <span aria-hidden="true" className="size-3 shrink-0 rounded-full border-2 border-dashed border-current" />
          <span className="text-foreground">{pairName ?? t('state.pending')}</span>
          <span className="text-muted">{t('earthMap.pending')}</span>
        </span>
      </div>
    </MapFrame>
  )
}
