const decimal = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const formatoFecha = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const unDecimal = (valor: number) => decimal.format(valor)
export const fechaCorta = (iso: string) => formatoFecha.format(new Date(iso))

/** Sustituye {clave} en un texto por su valor: rellenar('Faltan {faltan}', { faltan: 2 }) → 'Faltan 2'. */
export function rellenar(texto: string, valores: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (marca, clave: string) => (clave in valores ? String(valores[clave]) : marca))
}
