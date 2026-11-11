// Teaches TypeScript our translation keys: t('verdict.pas') becomes a build error
import type { resources } from '@/shared/i18n'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: (typeof resources)['es']
  }
}
