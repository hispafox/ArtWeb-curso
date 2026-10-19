// Un cliente de Supabase de mentira para las pruebas: no se conecta a ningún proyecto.
import { vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DiagnosticoRecibido } from '../servicios/diagnosticos'

interface Opciones {
  sesion?: { user: { id: string; email: string } } | null
  esMiembro?: boolean
  diagnosticos?: DiagnosticoRecibido[]
  errorAlGuardar?: string
  errorAlEntrar?: string
}

export function clienteFalso(opciones: Opciones = {}) {
  const insert = vi.fn().mockResolvedValue({ error: opciones.errorAlGuardar ? { message: opciones.errorAlGuardar } : null })
  const select = vi.fn((columnas: string) => ({
    columnas,
    order: vi.fn().mockResolvedValue({ data: opciones.diagnosticos ?? [], error: null }),
    eq: vi.fn(() => ({
      maybeSingle: vi.fn().mockResolvedValue({ data: opciones.esMiembro ? { usuario_id: opciones.sesion?.user.id } : null, error: null }),
    })),
  }))
  const from = vi.fn(() => ({ insert, select }))

  const signInWithPassword = vi.fn().mockResolvedValue({
    data: {},
    error: opciones.errorAlEntrar ? { message: opciones.errorAlEntrar } : null,
  })
  const signOut = vi.fn().mockResolvedValue({ error: null })
  const auth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: opciones.sesion ?? null } }),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    signInWithPassword,
    signOut,
  }

  return {
    cliente: { from, auth } as unknown as SupabaseClient,
    espias: { from, insert, select, signInWithPassword, signOut },
  }
}
