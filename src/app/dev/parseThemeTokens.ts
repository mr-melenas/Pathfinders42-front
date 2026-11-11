// Reads the design tokens declared in the @theme block of index.css,
// so the style guide never repeats token names or values by hand.

const TOKEN_GROUPS = ['color', 'text', 'radius', 'shadow'] as const

export type TokenGroup = (typeof TOKEN_GROUPS)[number]

export type ThemeToken = {
  name: string // without the group prefix: "surface-2" for --color-surface-2
  value: string // as written in index.css
}

export type ThemeTokens = Record<TokenGroup, ThemeToken[]>

// The @theme block ends at the first "}" at the start of a line
// (the nested @keyframes braces are indented, so they do not match)
const THEME_BLOCK = /@theme\s*\{([\s\S]*?)\n\}/
const COMMENT = /\/\*[\s\S]*?\*\//g
// "--color-surface-2: #18263f;" → group "color", name "surface-2", value "#18263f"
const DECLARATION = /--([a-z]+)-([a-z0-9-]+)\s*:\s*([^;]+);/g

function isTokenGroup(group: string): group is TokenGroup {
  return TOKEN_GROUPS.some((tokenGroup) => tokenGroup === group)
}

export function parseThemeTokens(css: string): ThemeTokens {
  const tokens: ThemeTokens = { color: [], text: [], radius: [], shadow: [] }
  const theme = css.match(THEME_BLOCK)?.[1] ?? ''
  const declarations = theme.replace(COMMENT, '')

  for (const [, group, name, value] of declarations.matchAll(DECLARATION)) {
    // Skip modifiers such as --text-body--line-height: they belong to their size token
    if (isTokenGroup(group) && !name.includes('--')) {
      tokens[group].push({ name, value: value.trim() })
    }
  }

  return tokens
}
