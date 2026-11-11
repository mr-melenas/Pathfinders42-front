import { useId, type ReactNode } from 'react'
import type { ThemeToken, TokenGroup } from '@/app/dev/parseThemeTokens'

type TokenSectionProps = {
  title: string
  group: TokenGroup
  tokens: ThemeToken[]
  // Draws the sample for one token; receives its CSS variable, e.g. "--color-surface"
  renderSample: (variable: string) => ReactNode
}

export function TokenSection({ title, group, tokens, renderSample }: TokenSectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h3 id={headingId} className="font-display text-card-title font-bold">
        {title}
      </h3>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tokens.map(({ name, value }) => {
          const variable = `--${group}-${name}`
          return (
            <li key={name} className="flex flex-col gap-1.5 rounded-card bg-surface p-3">
              {renderSample(variable)}
              <code className="font-mono text-data">{variable}</code>
              <span className="font-mono text-data break-all text-muted">{value}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
