// Punto único de entrada al contenido: los componentes leen de aquí, nunca de los JSON directamente.
import propuestaJson from './propuesta.json'
import textosJson from './textos.json'
import type { Propuesta } from './tipos'

export const propuesta: Propuesta = propuestaJson
export const textos = textosJson
export type Textos = typeof textosJson
