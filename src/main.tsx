import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts first: index.css uses their family names in the theme tokens
import '@fontsource-variable/red-hat-display'
import '@fontsource-variable/red-hat-text'
import '@fontsource-variable/red-hat-mono'
import './index.css'
// Initializes i18n (texts, saved language, <html lang>) before the first render
import '@/shared/i18n'
import { App } from '@/app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
