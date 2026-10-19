// El cliente de Supabase de la web. Usa solo la dirección del proyecto y la clave PUBLICABLE.
// Lo que protege los datos son las reglas de acceso (RLS) de supabase/migrations, no esta clave.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface Configuracion {
  url: string
  clave: string
}

interface Variables {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

/** Las claves antiguas son tokens JWT: la de servicio lleva dentro role = service_role. */
function esClaveDeServicioAntigua(clave: string): boolean {
  const partes = clave.split('.')
  if (partes.length !== 3) return false
  try {
    const carga = JSON.parse(atob(partes[1].replace(/-/g, '+').replace(/_/g, '/')))
    return carga?.role === 'service_role'
  } catch {
    return false
  }
}

/**
 * Lee la configuración de las variables VITE_. Devuelve null si falta alguna
 * (la web funciona igual, pero sin guardar nada) y se niega a seguir si alguien
 * ha puesto la clave secreta, que nunca puede ir en el navegador.
 */
export function leerConfiguracion(variables: Variables = import.meta.env): Configuracion | null {
  const url = variables.VITE_SUPABASE_URL?.trim()
  const clave = variables.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!url || !clave) return null
  if (clave.startsWith('sb_secret_') || esClaveDeServicioAntigua(clave)) {
    throw new Error(
      'La clave de VITE_SUPABASE_PUBLISHABLE_KEY es la SECRETA. Esa clave se salta las reglas de acceso y no puede ir en la web: pon la publicable (sb_publishable_…).',
    )
  }
  return { url, clave }
}

let cliente: SupabaseClient | null | undefined

/** El cliente compartido, o null si la web no tiene Supabase configurado. */
export function obtenerCliente(): SupabaseClient | null {
  if (cliente === undefined) {
    const configuracion = leerConfiguracion()
    cliente = configuracion ? createClient(configuracion.url, configuracion.clave) : null
  }
  return cliente
}
