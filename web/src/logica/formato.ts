const formatoEuros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const formatoFechaLarga = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
const formatoDiaSemana = new Intl.DateTimeFormat('es-ES', { weekday: 'long' })

export const euros = (cantidad: number) => formatoEuros.format(cantidad)
export const fechaLarga = (fecha: Date) => formatoFechaLarga.format(fecha)
export const diaSemana = (fecha: Date) => formatoDiaSemana.format(fecha)

/** Sustituye {clave} en un texto por su valor: rellenar('Plan {plan}', { plan: 'Piloto' }) → 'Plan Piloto'. */
export function rellenar(texto: string, valores: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (marca, clave: string) => (clave in valores ? String(valores[clave]) : marca))
}
