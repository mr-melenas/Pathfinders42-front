// Dev-only page that shows every design token, read straight from index.css.
// Its texts are plain English on purpose: it never reaches production, so it skips i18n.
import themeCss from '@/index.css?raw'
import { parseThemeTokens } from '@/app/dev/parseThemeTokens'
import { I18nSection } from '@/app/dev/I18nSection'
import { TokenSection } from '@/app/dev/TokenSection'
import { Logo } from '@/shared/ui/Logo'

const tokens = parseThemeTokens(themeCss)

export function StyleGuide() {
  return (
    <aside aria-labelledby="style-guide-title" className="mx-auto flex max-w-5xl flex-col gap-8 p-4">
      <h2 id="style-guide-title" className="font-display text-panel-title font-extrabold tracking-display">
        Style guide <span className="text-muted">(dev only)</span>
      </h2>

      <TokenSection
        title="Colors"
        group="color"
        tokens={tokens.color}
        renderSample={(variable) => (
          <span aria-hidden="true" className="h-10 rounded-chip border border-border" style={{ backgroundColor: `var(${variable})` }} />
        )}
      />

      <TokenSection
        title="Text sizes"
        group="text"
        tokens={tokens.text}
        renderSample={(variable) => (
          <span style={{ fontSize: `var(${variable})`, lineHeight: `var(${variable}--line-height)` }}>Pathfinders42</span>
        )}
      />

      <TokenSection
        title="Radii"
        group="radius"
        tokens={tokens.radius}
        renderSample={(variable) => (
          <span aria-hidden="true" className="h-10 w-16 border border-border bg-surface-2" style={{ borderRadius: `var(${variable})` }} />
        )}
      />

      <TokenSection
        title="Shadows"
        group="shadow"
        tokens={tokens.shadow}
        renderSample={(variable) => (
          <span aria-hidden="true" className="mt-3 h-10 w-16 bg-surface-2" style={{ boxShadow: `var(${variable})` }} />
        )}
      />

      <I18nSection />

      <section aria-labelledby="style-guide-components" className="flex flex-col gap-3">
        <h3 id="style-guide-components" className="font-display text-card-title font-bold">
          Components
        </h3>
        <div className="flex flex-col items-start gap-1.5 rounded-card bg-surface p-3">
          <Logo />
          <code className="font-mono text-data">Logo</code>
        </div>
      </section>
    </aside>
  )
}
