// Forma que tienen que tener los datos de propuesta.json.
// Si alguien cambia el JSON y se deja un campo, la compilación lo avisa.

export interface PuntoAlcance {
  id: string
  texto: string
}

export interface Plan {
  id: string
  nombre: string
  lema: string
  /** Semanas de cada fase, en el orden de «fases» */
  semanasPorFase: number[]
  precio: number
  /** Horas de formación */
  formacion: number
  /** Personas del equipo del proyecto */
  equipo: number
  incluye: string[]
}

export interface Extra {
  id: string
  titulo: string
  detalle: string
  precio: number
  /** Horas de formación que suma */
  formacion?: number
  /** Semanas que alarga una fase: «fase» es su posición en «fases», empezando por 0 */
  semanas?: { fase: number; mas: number }
  /** Semanas de soporte después de la puesta en marcha */
  acompanamiento?: number
  /** Planes que ya lo traen incluido */
  incluidoEn?: string[]
}

export interface Propuesta {
  /** Fecha de la propuesta, en formato AAAA-MM-DD */
  fecha: string
  diasValidez: number
  /** Fecha de arranque que sale propuesta, en formato AAAA-MM-DD */
  inicioPorDefecto: string
  /** El plan que sale elegido al abrir la página */
  planInicial: string
  fases: string[]
  alcance: PuntoAlcance[]
  planes: Plan[]
  extras: Extra[]
}
