// Punto único de entrada al contenido: los componentes leen de aquí, nunca de los JSON directamente.
import diagnosticoJson from './diagnostico.json'
import textosJson from './textos.json'

export interface Area {
  id: string
  nombre: string
  consejo: string
}

export interface Pregunta {
  id: string
  area: string
  texto: string
  /** Cuatro opciones: la primera vale 1 y la última, 4 */
  opciones: string[]
}

export interface Nivel {
  /** El nivel es el primero cuya «hasta» supera la media */
  hasta: number
  nombre: string
  texto: string
}

export interface Diagnostico {
  areas: Area[]
  preguntas: Pregunta[]
  niveles: Nivel[]
  /** Respuestas que salen marcadas al abrir la página */
  ejemplo: Record<string, number>
}

export const diagnostico: Diagnostico = diagnosticoJson
export const textos = textosJson
