import type { ComponentProps } from 'react'

const LINK_STYLE = 'cursor-pointer text-caption text-horizon underline underline-offset-3 hover:text-foreground'

type ButtonProps = ComponentProps<'button'> & { href?: never }
type AnchorProps = ComponentProps<'a'> & { href: string }

// Looks like a link, but uses the right element: <a> when it goes somewhere (href),
// <button> when it does something on the same page (onClick)
export function LinkButton(props: ButtonProps | AnchorProps) {
  if (props.href !== undefined) {
    const { className = '', ...anchorProps } = props
    return <a className={`${LINK_STYLE} ${className}`} {...anchorProps} />
  }

  const { className = '', type = 'button', ...buttonProps } = props
  return <button type={type} className={`${LINK_STYLE} ${className}`} {...buttonProps} />
}
