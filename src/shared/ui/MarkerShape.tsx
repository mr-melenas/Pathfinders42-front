import { SHAPE_CLASS, type Shape } from '@/shared/lib/siteShapes'

type MarkerShapeProps = {
  shape: Shape
}

// The drawing of a site's shape, in the current text colour. Used by the map markers and by the legend
export function MarkerShape({ shape }: MarkerShapeProps) {
  return (
    // Dark ring so the shape stands out on light and dark parts of the image
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center ring-1 ring-map ${SHAPE_CLASS[shape]}`}>
      {shape === 'cave' && <span className="size-1 rounded-full bg-current" />}
    </span>
  )
}
