import es from '@/shared/i18n/locales/es.json'

// API values that have a translated text. The known values come from the translation files,
// so they are never written twice.

// The site's "tipo": its texts live in "siteType" with the API value as the key
export type SiteType = keyof typeof es.siteType

export function isSiteType(value: string): value is SiteType {
  return Object.hasOwn(es.siteType, value)
}

// Display order of the site types: the order of "siteType" in the translation files (Artemis first)
export const SITE_TYPE_ORDER: readonly string[] = Object.keys(es.siteType)

// The API's "cuerpo" values and the key of their name
export const BODY_LABEL_KEYS = { luna: 'body.moon', marte: 'body.mars' } as const

export type Body = keyof typeof BODY_LABEL_KEYS

export function isBody(value: string): value is Body {
  return Object.hasOwn(BODY_LABEL_KEYS, value)
}

// The pair's "detalles.verificacion": its texts live in "verification" with the API value as the key
export type VerificationStatus = keyof typeof es.verification

export function isVerificationStatus(value: string): value is VerificationStatus {
  return Object.hasOwn(es.verification, value)
}
