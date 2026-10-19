/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El número de versión sale del package.json y se muestra al pie de la web
const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: { __VERSION__: JSON.stringify(version) },
  server: { port: 5173 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/pruebas/preparar.ts'],
  },
})
