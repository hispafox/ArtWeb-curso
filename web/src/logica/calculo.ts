// Los cálculos de la propuesta, sin nada de pantalla: los mismos del artefacto original.
import type { Plan, Propuesta } from '../contenido/tipos'

export interface Eleccion {
  plan: string
  extras: string[]
  /** Fecha de arranque, en formato AAAA-MM-DD */
  inicio: string
}

export interface Resultado {
  plan: Plan
  semanas: number[]
  total: number
  precio: number
  formacion: number
  incluye: Set<string>
  /** Semanas de soporte después de la puesta en marcha (0 si no hay) */
  acompanamiento: number
  inicio: Date
  fin: Date
}

const SOPORTE_POR_DEFECTO = 12

/** Convierte «2026-11-02» en una fecha local, sin desfases por la zona horaria. */
export function aFecha(texto: string): Date {
  const [anio, mes, dia] = texto.split('-').map(Number)
  return new Date(anio, mes - 1, dia)
}

export function masDias(fecha: Date, dias: number): Date {
  const nueva = new Date(fecha)
  nueva.setDate(nueva.getDate() + dias)
  return nueva
}

/** Si un extra ya viene en el plan, no se cobra ni se suma. */
export function extraIncluido(propuesta: Propuesta, extraId: string, planId: string): boolean {
  return (propuesta.extras.find((x) => x.id === extraId)?.incluidoEn ?? []).includes(planId)
}

export function calcular(eleccion: Eleccion, propuesta: Propuesta): Resultado {
  const plan = propuesta.planes.find((p) => p.id === eleccion.plan)
  if (!plan) throw new Error(`No existe el plan «${eleccion.plan}»`)

  const semanas = [...plan.semanasPorFase]
  let precio = plan.precio
  let formacion = plan.formacion
  let acompanamiento = 0
  const incluye = new Set(plan.incluye)

  for (const extra of propuesta.extras) {
    if (!eleccion.extras.includes(extra.id) || (extra.incluidoEn ?? []).includes(plan.id)) continue
    precio += extra.precio
    if (extra.semanas) semanas[extra.semanas.fase] += extra.semanas.mas
    if (extra.formacion) formacion += extra.formacion
    if (extra.acompanamiento) {
      acompanamiento = extra.acompanamiento
      incluye.add('soporte')
    }
  }
  if (incluye.has('soporte') && !acompanamiento) acompanamiento = SOPORTE_POR_DEFECTO

  const total = semanas.reduce((a, b) => a + b, 0)
  const inicio = aFecha(eleccion.inicio)
  const fin = masDias(inicio, total * 7 - 3) // el viernes de la última semana
  return { plan, semanas, total, precio, formacion, incluye, acompanamiento, inicio, fin }
}

export interface Barra {
  nombre: string
  semanas: number
  /** Posición y ancho en porcentaje del calendario */
  izquierda: number
  ancho: number
  soporte: boolean
}

/** Las barras del calendario: una por fase y, si hay soporte, otra después de la puesta en marcha. */
export function barras(resultado: Resultado, fases: string[], nombreSoporte: string): { barras: Barra[]; totalVista: number } {
  const totalVista = resultado.total + resultado.acompanamiento
  let desde = 0
  const lista: Barra[] = fases.map((nombre, i) => {
    const barra = {
      nombre,
      semanas: resultado.semanas[i],
      izquierda: (desde / totalVista) * 100,
      ancho: (resultado.semanas[i] / totalVista) * 100,
      soporte: false,
    }
    desde += resultado.semanas[i]
    return barra
  })
  if (resultado.acompanamiento) {
    lista.push({
      nombre: nombreSoporte,
      semanas: resultado.acompanamiento,
      izquierda: (resultado.total / totalVista) * 100,
      ancho: (resultado.acompanamiento / totalVista) * 100,
      soporte: true,
    })
  }
  return { barras: lista, totalVista }
}
