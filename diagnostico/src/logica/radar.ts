// Geometría del gráfico de radar del informe, la misma del artefacto original.

export const CX = 180
export const CY = 160
export const RADIO = 112

/** Punto del eje «i» de «n» para un valor de 0 a 4 (más allá de 4, para las etiquetas) */
export function punto(i: number, n: number, valor: number): [number, number] {
  const angulo = -Math.PI / 2 + (i * 2 * Math.PI) / n
  return [CX + (Math.cos(angulo) * (RADIO * valor)) / 4, CY + (Math.sin(angulo) * (RADIO * valor)) / 4]
}

export function puntos(valores: number[]): string {
  return valores.map((v, i) => punto(i, valores.length, v).join(',')).join(' ')
}

/** Lo mínimo que se dibuja para que un área sin respuestas no desaparezca del gráfico */
export const visible = (valor: number) => Math.max(valor, 0.15)
