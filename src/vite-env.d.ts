/// <reference types="vite/client" />

// Types of our environment variables (only the VITE_* ones reach the browser)
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
