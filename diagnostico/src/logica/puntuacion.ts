// La puntuación del diagnóstico, sin nada de pantalla: la misma del artefacto original.
import type { Area, Diagnostico, Nivel } from '../contenido'

/** Lo que ha contestado cada pregunta: de 1 a 4, por su id */
export type Respuestas = Record<string, number>

export interface ValorArea extends Area {
  /** Media de sus preguntas, de 1 a 4 (0 si no hay ninguna contestada) */
  valor: number
  completa: boolean
}

export interface Puntuacion {
  porArea: ValorArea[]
  contestadas: number
  /** Media de las áreas con alguna respuesta (0 si no hay ninguna) */
  media: number
  nivel: Nivel | null
  /** Posición del nivel en la lista, para la escalera (-1 si no hay nivel) */
  indiceNivel: number
  /** El área con menos puntuación, para el consejo */
  floja: ValorArea | null
}

export function puntuar(respuestas: Respuestas, diagnostico: Diagnostico): Puntuacion {
  const porArea = diagnostico.areas.map((a) => {
    const suyas = diagnostico.preguntas.filter((p) => p.area === a.id)
    const valores = suyas.map((p) => respuestas[p.id]).filter(Boolean)
    return {
      ...a,
      valor: valores.length ? valores.reduce((x, y) => x + y, 0) / valores.length : 0,
      completa: valores.length === suyas.length,
    }
  })
  const contestadas = diagnostico.preguntas.filter((p) => respuestas[p.id]).length
  const conValor = porArea.filter((a) => a.valor > 0)
  const media = conValor.length ? conValor.reduce((x, a) => x + a.valor, 0) / conValor.length : 0
  const indiceNivel = media ? diagnostico.niveles.findIndex((n) => media < n.hasta) : -1
  const floja = [...conValor].sort((x, y) => x.valor - y.valor)[0] ?? null
  return {
    porArea,
    contestadas,
    media,
    nivel: indiceNivel >= 0 ? diagnostico.niveles[indiceNivel] : null,
    indiceNivel,
    floja,
  }
}

/** Las respuestas en el orden de las preguntas, para guardarlas. */
export function enOrden(respuestas: Respuestas, diagnostico: Diagnostico): number[] {
  return diagnostico.preguntas.map((p) => respuestas[p.id])
}
