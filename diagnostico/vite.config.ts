/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Solo las variables que empiezan por VITE_ llegan al navegador. La clave secreta nunca lleva ese prefijo.
  envPrefix: 'VITE_',
  server: { port: 5174 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/pruebas/preparar.ts'],
    // Las pruebas no usan el .env de nadie: trabajan sin conexión a Supabase
    env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '' },
  },
})
