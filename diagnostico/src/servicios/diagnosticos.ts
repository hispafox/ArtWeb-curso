// Lo que la web guarda y lee en Supabase. Las reglas de quién puede hacer qué están en supabase/migrations.
import type { SupabaseClient } from '@supabase/supabase-js'

export const TABLA = 'diagnosticos'

export interface NuevoDiagnostico {
  empresa: string
  correo: string
  aceptaContacto: boolean
  /** Las respuestas en el orden de las preguntas, de 1 a 4 */
  contestaciones: number[]
  /** Media sobre 4 */
  media: number
  nivel: string
}

export interface DiagnosticoRecibido {
  id: string
  creado_en: string
  empresa: string | null
  correo: string | null
  acepta_contacto: boolean
  media: number
  nivel: string
}

export type ErrorValidacion = 'correo' | 'permiso'

const FORMA_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Las mismas comprobaciones que hace la base de datos, para avisar antes de enviar. */
export function validar(nuevo: NuevoDiagnostico): ErrorValidacion | null {
  const correo = nuevo.correo.trim()
  if (correo && !FORMA_CORREO.test(correo)) return 'correo'
  if (correo && !nuevo.aceptaContacto) return 'permiso'
  return null
}

/** Convierte lo del formulario en la fila de la tabla. Lo que se deja en blanco va vacío (null). */
export function aFila(nuevo: NuevoDiagnostico) {
  const empresa = nuevo.empresa.trim()
  const correo = nuevo.correo.trim()
  return {
    empresa: empresa ? empresa.slice(0, 120) : null,
    correo: correo || null,
    acepta_contacto: Boolean(correo) && nuevo.aceptaContacto,
    contestaciones: nuevo.contestaciones,
    media: Math.round(nuevo.media * 100) / 100,
    nivel: nuevo.nivel,
  }
}

/**
 * Envía un diagnóstico. No pide que le devuelva la fila guardada: quien contesta
 * no tiene permiso para leer la tabla, ni siquiera lo que acaba de enviar.
 */
export async function guardarDiagnostico(cliente: SupabaseClient, nuevo: NuevoDiagnostico): Promise<void> {
  const { error } = await cliente.from(TABLA).insert(aFila(nuevo))
  if (error) throw new Error(`No se ha podido guardar el diagnóstico: ${error.message}`)
}

/** Los diagnósticos recibidos, del más reciente al más antiguo. Solo devuelve algo a quien es del equipo. */
export async function listarDiagnosticos(cliente: SupabaseClient): Promise<DiagnosticoRecibido[]> {
  const { data, error } = await cliente
    .from(TABLA)
    .select('id, creado_en, empresa, correo, acepta_contacto, media, nivel')
    .order('creado_en', { ascending: false })
  if (error) throw new Error(`No se han podido leer los diagnósticos: ${error.message}`)
  // La base de datos devuelve los números decimales como texto
  return (data ?? []).map((d) => ({ ...d, media: Number(d.media) })) as DiagnosticoRecibido[]
}

/** Si el usuario con la sesión iniciada está dado de alta en el equipo. */
export async function esDelEquipo(cliente: SupabaseClient, usuarioId: string): Promise<boolean> {
  const { data, error } = await cliente.from('miembros_equipo').select('usuario_id').eq('usuario_id', usuarioId).maybeSingle()
  if (error) throw new Error(`No se ha podido comprobar el acceso: ${error.message}`)
  return data !== null
}

export interface Resumen {
  total: number
  /** Media de las medias, sobre 4 */
  media: number
  conCorreo: number
  porNivel: Record<string, number>
}

export function resumir(diagnosticos: DiagnosticoRecibido[]): Resumen {
  const total = diagnosticos.length
  const media = total ? diagnosticos.reduce((s, d) => s + d.media, 0) / total : 0
  const porNivel: Record<string, number> = {}
  for (const d of diagnosticos) porNivel[d.nivel] = (porNivel[d.nivel] ?? 0) + 1
  return { total, media, conCorreo: diagnosticos.filter((d) => d.correo).length, porNivel }
}
