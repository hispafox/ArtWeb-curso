import { describe, expect, test } from 'vitest'
import { diaSemana, euros, rellenar } from './formato'
import { aFecha } from './calculo'

describe('formato', () => {
  test('escribe los euros sin decimales, a la española', () => {
    expect(euros(9800).replace(/\s/g, ' ')).toBe('9800 €')
    expect(euros(24500).replace(/\s/g, ' ')).toBe('24.500 €')
  })

  test('dice el día de la semana', () => {
    expect(diaSemana(aFecha('2026-11-02'))).toBe('lunes')
  })

  test('rellena las marcas entre llaves y deja a la vista las que no tienen valor', () => {
    expect(rellenar('{semanas} semanas', { semanas: 10 })).toBe('10 semanas')
    expect(rellenar('Hola {nombre}', {})).toBe('Hola {nombre}')
  })
})
