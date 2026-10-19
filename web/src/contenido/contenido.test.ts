// Comprueba que los JSON de contenido siguen siendo coherentes después de cambiarlos.
import { describe, expect, test } from 'vitest'
import { propuesta, textos } from '.'

function textosVacios(valor: unknown, ruta = 'textos'): string[] {
  if (typeof valor === 'string') return valor.trim() === '' ? [ruta] : []
  if (Array.isArray(valor)) return valor.flatMap((v, i) => textosVacios(v, `${ruta}[${i}]`))
  if (valor && typeof valor === 'object') return Object.entries(valor).flatMap(([k, v]) => textosVacios(v, `${ruta}.${k}`))
  return []
}

const FECHA = /^\d{4}-\d{2}-\d{2}$/

describe('propuesta.json', () => {
  const alcance = propuesta.alcance.map((a) => a.id)
  const planes = propuesta.planes.map((p) => p.id)

  test('cada plan solo incluye cosas que están en el alcance', () => {
    for (const plan of propuesta.planes) {
      for (const id of plan.incluye) expect(alcance, `${plan.nombre} incluye «${id}»`).toContain(id)
    }
  })

  test('cada plan tiene unas semanas para cada fase, todas positivas', () => {
    for (const plan of propuesta.planes) {
      expect(plan.semanasPorFase, plan.nombre).toHaveLength(propuesta.fases.length)
      for (const s of plan.semanasPorFase) expect(s, plan.nombre).toBeGreaterThan(0)
    }
  })

  test('los extras alargan fases que existen y se incluyen en planes que existen', () => {
    for (const extra of propuesta.extras) {
      if (extra.semanas) expect(extra.semanas.fase, extra.titulo).toBeLessThan(propuesta.fases.length)
      for (const id of extra.incluidoEn ?? []) expect(planes, extra.titulo).toContain(id)
    }
  })

  test('los identificadores no se repiten', () => {
    expect(new Set(planes).size).toBe(planes.length)
    expect(new Set(alcance).size).toBe(alcance.length)
    expect(new Set(propuesta.extras.map((x) => x.id)).size).toBe(propuesta.extras.length)
  })

  test('el plan que sale elegido existe', () => {
    expect(planes).toContain(propuesta.planInicial)
  })

  test('precios positivos y fechas bien escritas', () => {
    for (const p of [...propuesta.planes, ...propuesta.extras]) expect(p.precio).toBeGreaterThan(0)
    expect(propuesta.fecha).toMatch(FECHA)
    expect(propuesta.inicioPorDefecto).toMatch(FECHA)
    expect(propuesta.inicioPorDefecto >= propuesta.fecha).toBe(true)
  })
})

describe('textos.json', () => {
  test('no hay ningún texto vacío', () => {
    expect(textosVacios(textos)).toEqual([])
  })

  test('el correo de contacto tiene forma de correo', () => {
    expect(textos.contacto.correo).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  })
})
