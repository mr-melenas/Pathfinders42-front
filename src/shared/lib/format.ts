// Number formatting for the UI, following the language: 0,229 (es) / 0.229 (en).
// Pure functions that receive the language, so they can be tested without i18n.

const MINUS_SIGN = '−' // typographic minus (−), instead of the hyphen Intl uses
const NO_BREAK_SPACE = ' ' // keeps a number and its unit on the same line

// Formats with Intl and swaps the minus sign part for the typographic one
function formatParts(value: number, language: string, options: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(language, options)
    .formatToParts(value)
    .map((part) => {
      if (part.type === 'minusSign') return MINUS_SIGN
      // A plain space could split a number from its unit across two lines
      if (part.type === 'literal' && part.value === ' ') return NO_BREAK_SPACE
      return part.value
    })
    .join('')
}

export function formatNumber(value: number, language: string, maximumFractionDigits = 3): string {
  return formatParts(value, language, { maximumFractionDigits })
}

export function formatTemperature(value: number, language: string): string {
  return formatParts(value, language, { style: 'unit', unit: 'celsius', maximumFractionDigits: 1 })
}

export function formatDistance(value: number, language: string): string {
  return formatParts(value, language, { style: 'unit', unit: 'kilometer', maximumFractionDigits: 1 })
}

export function formatCoordinate(value: number, language: string): string {
  // "narrow" gives "°" in every language ("short" is "deg" in English)
  return formatParts(value, language, { style: 'unit', unit: 'degree', unitDisplay: 'narrow', maximumFractionDigits: 4 })
}

// Intl has no square-kilometre unit, so the symbol is added after the formatted number
export function formatArea(value: number, language: string): string {
  return `${formatParts(value, language, { maximumFractionDigits: 1 })}${NO_BREAK_SPACE}km²`
}
