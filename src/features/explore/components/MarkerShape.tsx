import type { Shape } from '@/features/explore/components/siteShapes'

const SHAPE_CLASS: Record<Shape, string> = {
  region: 'size-3 border-2 border-current bg-current/18', // square with an 18 % fill
  landing: 'size-2.5 rotate-45 bg-current', // diamond
  cave: 'size-3 rounded-full border-2 border-current', // ring, with a dot inside
  unknown: 'size-2.5 rounded-full bg-current', // plain dot
}

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
