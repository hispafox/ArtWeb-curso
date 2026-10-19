/// <reference types="vite/client" />

// Las únicas variables de entorno que lee la web. Las dos son públicas: van dentro de la web publicada.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}
