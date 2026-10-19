import { describe, expect, test } from 'vitest'
import { leerConfiguracion } from './supabase'

// Un token con forma de JWT y el rol que se le pase, como las claves antiguas de Supabase
const jwt = (role: string) => `cabecera.${btoa(JSON.stringify({ role })).replace(/=+$/, '')}.firma`

describe('la configuración de Supabase', () => {
  test('sin variables, la web funciona sin guardar nada', () => {
    expect(leerConfiguracion({})).toBeNull()
    expect(leerConfiguracion({ VITE_SUPABASE_URL: 'https://x.supabase.co' })).toBeNull()
    expect(leerConfiguracion({ VITE_SUPABASE_URL: ' ', VITE_SUPABASE_PUBLISHABLE_KEY: ' ' })).toBeNull()
  })

  test('con la dirección y la clave publicable, devuelve la configuración', () => {
    expect(leerConfiguracion({
      VITE_SUPABASE_URL: 'https://x.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_ejemplo',
    })).toEqual({ url: 'https://x.supabase.co', clave: 'sb_publishable_ejemplo' })
  })

  test('se niega a usar la clave secreta', () => {
    expect(() => leerConfiguracion({
      VITE_SUPABASE_URL: 'https://x.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_ejemplo',
    })).toThrow(/SECRETA/)
  })

  test('se niega a usar la antigua clave de servicio, y acepta la antigua anónima', () => {
    expect(() => leerConfiguracion({ VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: jwt('service_role') })).toThrow(/SECRETA/)
    expect(leerConfiguracion({ VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: jwt('anon') })).not.toBeNull()
  })

  test('en las pruebas no hay ningún proyecto configurado', () => {
    expect(leerConfiguracion()).toBeNull()
  })
})
