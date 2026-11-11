import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/shared/i18n/locales/en.json'
import es from '@/shared/i18n/locales/es.json'

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: Language = 'es'

const STORAGE_KEY = 'pathfinders42.language'

// Spanish is the model: "satisfies" makes the build fail if en.json misses a key
export const resources = {
  es: { translation: es },
  en: { translation: en satisfies typeof es },
}

function isLanguage(value: string | null): value is Language {
  return SUPPORTED_LANGUAGES.some((language) => language === value)
}

// localStorage can throw (private mode, blocked storage): it must never break the app
function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

function storeLanguage(language: string) {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Storage unavailable: the language just won't be remembered
  }
}

// Registered before init, so it also runs for the first language.
// <html lang> tells screen readers which pronunciation to use.
i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
  storeLanguage(language)
})

void i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false }, // React already escapes the text it renders
})

export { i18n }
