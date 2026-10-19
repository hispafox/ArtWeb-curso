import { describe, expect, test } from 'vitest'
import { diagnostico } from '../contenido'
import { enOrden, puntuar } from './puntuacion'

const todas = (valor: number) => Object.fromEntries(diagnostico.preguntas.map((p) => [p.id, valor]))

describe('la puntuación', () => {
  test('las respuestas de ejemplo dan nivel Probando y señalan los procesos', () => {
    const p = puntuar(diagnostico.ejemplo, diagnostico)
    expect(p.contestadas).toBe(8)
    expect(p.porArea.map((a) => a.valor)).toEqual([2, 2.5, 1.5, 1.5])
    expect(p.media).toBeCloseTo(1.875)
    expect(p.nivel?.nombre).toBe('Probando')
    expect(p.indiceNivel).toBe(1)
    expect(p.floja?.id).toBe('procesos')
  })

  test('todo a 4 es Transformando, y todo a 1, Explorando', () => {
    expect(puntuar(todas(4), diagnostico).nivel?.nombre).toBe('Transformando')
    expect(puntuar(todas(1), diagnostico).nivel?.nombre).toBe('Explorando')
  })

  test('los límites de cada nivel', () => {
    const conMedia = (media: number) => diagnostico.niveles.find((n) => media < n.hasta)?.nombre
    expect(conMedia(1.74)).toBe('Explorando')
    expect(conMedia(1.75)).toBe('Probando')
    expect(conMedia(2.5)).toBe('Integrando')
    expect(conMedia(3.25)).toBe('Transformando')
  })

  test('sin respuestas no hay nivel ni consejo', () => {
    const p = puntuar({}, diagnostico)
    expect([p.contestadas, p.media, p.nivel, p.indiceNivel, p.floja]).toEqual([0, 0, null, -1, null])
  })

  test('con respuestas a medias, la media cuenta solo las áreas contestadas', () => {
    const p = puntuar({ p1: 4, p3: 2 }, diagnostico)
    expect(p.contestadas).toBe(2)
    expect(p.media).toBe(3)
    expect(p.porArea.find((a) => a.id === 'datos')?.completa).toBe(false)
  })

  test('las respuestas se guardan en el orden de las preguntas', () => {
    expect(enOrden(diagnostico.ejemplo, diagnostico)).toEqual([2, 2, 3, 2, 1, 2, 2, 1])
  })

  test('cada pregunta es de un área que existe y tiene cuatro opciones', () => {
    const ids = diagnostico.areas.map((a) => a.id)
    for (const p of diagnostico.preguntas) {
      expect(ids).toContain(p.area)
      expect(p.opciones).toHaveLength(4)
    }
  })

  test('el ejemplo contesta preguntas que existen, con valores de 1 a 4', () => {
    const ids = diagnostico.preguntas.map((p) => p.id)
    for (const [id, valor] of Object.entries(diagnostico.ejemplo)) {
      expect(ids).toContain(id)
      expect(valor).toBeGreaterThanOrEqual(1)
      expect(valor).toBeLessThanOrEqual(4)
    }
  })

  test('los nombres de los niveles coinciden con los que admite la base de datos', () => {
    expect(diagnostico.niveles.map((n) => n.nombre)).toEqual(['Explorando', 'Probando', 'Integrando', 'Transformando'])
  })
})
