import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Read the "@/*" alias from tsconfig paths, so it is defined in one place only
  resolve: { tsconfigPaths: true },
})
