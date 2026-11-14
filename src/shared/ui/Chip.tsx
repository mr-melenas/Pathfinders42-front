import type { ComponentProps } from 'react'

// Shape shared by every chip (verdict, verification, site type).
// Each chip adds its own color, font weight and icon through className and children.
export function Chip({ className = '', ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-chip border py-1 pr-2.5 pl-1.75 text-caption leading-tight ${className}`}
      {...props}
    />
  )
}
