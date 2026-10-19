import { describe, expect, test } from 'vitest'
import { propuesta } from '../contenido'
import { aFecha, barras, calcular, extraIncluido, masDias } from './calculo'
import { fechaLarga } from './formato'

const eleccion = (plan: string, extras: string[] = [], inicio = '2026-11-02') => ({ plan, extras, inicio })

describe('el cálculo de la propuesta', () => {
  test('cada plan, sin extras', () => {
    const piloto = calcular(eleccion('piloto'), propuesta)
    expect([piloto.total, piloto.precio, piloto.formacion]).toEqual([6, 9800, 4])
    const implantacion = calcular(eleccion('implantacion'), propuesta)
    expect([implantacion.total, implantacion.precio, implantacion.formacion]).toEqual([10, 24500, 8])
    const escala = calcular(eleccion('escala'), propuesta)
    expect([escala.total, escala.precio, escala.formacion]).toEqual([14, 41000, 16])
  })

  test('la puesta en marcha es el viernes de la última semana', () => {
    expect(fechaLarga(calcular(eleccion('piloto'), propuesta).fin)).toBe('11 de diciembre de 2026')
    expect(fechaLarga(calcular(eleccion('implantacion'), propuesta).fin)).toBe('8 de enero de 2027')
    expect(calcular(eleccion('implantacion'), propuesta).fin.getDay()).toBe(5)
  })

  test('el inglés suma su precio y dos semanas a la construcción', () => {
    const r = calcular(eleccion('implantacion', ['ingles']), propuesta)
    expect(r.precio).toBe(24500 + 3200)
    expect(r.semanas).toEqual([2, 2, 5, 2, 1])
    expect(r.total).toBe(12)
  })

  test('la formación para supervisores suma horas y una semana a la última fase', () => {
    const r = calcular(eleccion('piloto', ['supervisores']), propuesta)
    expect(r.formacion).toBe(12)
    expect(r.semanas).toEqual([1, 1, 2, 1, 2])
    expect(r.precio).toBe(9800 + 2400)
  })

  test('el soporte añade doce semanas después de la puesta en marcha, sin retrasarla', () => {
    const r = calcular(eleccion('implantacion', ['soporte']), propuesta)
    expect(r.precio).toBe(24500 + 3600)
    expect(r.incluye.has('soporte')).toBe(true)
    expect(r.acompanamiento).toBe(12)
    expect(r.total).toBe(10)
  })

  test('en el plan Escala el soporte ya viene incluido y no se cobra dos veces', () => {
    expect(extraIncluido(propuesta, 'soporte', 'escala')).toBe(true)
    const r = calcular(eleccion('escala', ['soporte']), propuesta)
    expect(r.precio).toBe(41000)
    expect(r.acompanamiento).toBe(12)
  })

  test('las barras del calendario se colocan una detrás de otra, con el soporte al final', () => {
    const { barras: lista, totalVista } = barras(calcular(eleccion('escala'), propuesta), propuesta.fases, 'Soporte')
    expect(totalVista).toBe(26)
    expect(lista).toHaveLength(6)
    expect(lista.at(-1)).toMatchObject({ nombre: 'Soporte', soporte: true, semanas: 12 })
    expect(lista[1].izquierda).toBeCloseTo((2 / 26) * 100)
  })

  test('un plan que no existe se avisa', () => {
    expect(() => calcular(eleccion('otro'), propuesta)).toThrow(/No existe el plan/)
  })

  test('las fechas se leen sin desfase de zona horaria', () => {
    const d = aFecha('2026-11-02')
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getDay()]).toEqual([2026, 10, 2, 1])
    expect(fechaLarga(masDias(aFecha('2026-10-19'), 30))).toBe('18 de noviembre de 2026')
  })
})
