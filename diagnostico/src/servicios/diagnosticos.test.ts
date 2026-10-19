import { describe, expect, test } from 'vitest'
import { clienteFalso } from '../pruebas/clienteFalso'
import { aFila, esDelEquipo, guardarDiagnostico, listarDiagnosticos, resumir, validar, type NuevoDiagnostico } from './diagnosticos'

const base: NuevoDiagnostico = {
  empresa: '  Talleres de ejemplo  ', correo: '', aceptaContacto: false,
  contestaciones: [2, 2, 3, 2, 1, 2, 2, 1], media: 1.875, nivel: 'Probando',
}

describe('validar', () => {
  test('sin correo no hace falta permiso', () => {
    expect(validar(base)).toBeNull()
  })

  test('con correo hace falta marcar el permiso', () => {
    expect(validar({ ...base, correo: 'ana@example.com' })).toBe('permiso')
    expect(validar({ ...base, correo: 'ana@example.com', aceptaContacto: true })).toBeNull()
  })

  test('un correo sin forma de correo no vale', () => {
    expect(validar({ ...base, correo: 'ana-arroba-example', aceptaContacto: true })).toBe('correo')
  })
})

describe('aFila', () => {
  test('recorta los espacios, redondea la media a dos decimales y deja vacío lo que no se rellena', () => {
    expect(aFila(base)).toEqual({
      empresa: 'Talleres de ejemplo', correo: null, acepta_contacto: false,
      contestaciones: base.contestaciones, media: 1.88, nivel: 'Probando',
    })
  })

  test('el permiso solo cuenta si hay correo', () => {
    expect(aFila({ ...base, aceptaContacto: true }).acepta_contacto).toBe(false)
    expect(aFila({ ...base, correo: 'ana@example.com', aceptaContacto: true }).acepta_contacto).toBe(true)
  })

  test('no envía ni el id ni la fecha: los pone la base de datos', () => {
    expect(Object.keys(aFila(base))).not.toContain('id')
    expect(Object.keys(aFila(base))).not.toContain('creado_en')
  })
})

describe('guardarDiagnostico', () => {
  test('inserta en la tabla diagnosticos sin pedir que le devuelva la fila', async () => {
    const { cliente, espias } = clienteFalso()
    await guardarDiagnostico(cliente, base)
    expect(espias.from).toHaveBeenCalledWith('diagnosticos')
    expect(espias.insert).toHaveBeenCalledWith(aFila(base))
    // Quien contesta no puede leer la tabla, así que no se encadena .select()
    expect(espias.select).not.toHaveBeenCalled()
  })

  test('avisa si la base de datos lo rechaza', async () => {
    const { cliente } = clienteFalso({ errorAlGuardar: 'new row violates row-level security policy' })
    await expect(guardarDiagnostico(cliente, base)).rejects.toThrow(/No se ha podido guardar/)
  })
})

describe('lectura para el panel', () => {
  const recibidos = [
    { id: '1', creado_en: '2026-10-23T09:00:00Z', empresa: 'A', correo: 'a@example.com', acepta_contacto: true, media: 3.5, nivel: 'Transformando' },
    { id: '2', creado_en: '2026-10-23T08:00:00Z', empresa: null, correo: null, acepta_contacto: false, media: 1.88, nivel: 'Probando' },
    { id: '3', creado_en: '2026-10-22T08:00:00Z', empresa: 'C', correo: null, acepta_contacto: false, media: 2.12, nivel: 'Probando' },
  ]

  test('lista solo las columnas que enseña el panel y convierte la media en número', async () => {
    const comoTexto = recibidos.map((d) => ({ ...d, media: String(d.media) }))
    const { cliente, espias } = clienteFalso({ diagnosticos: comoTexto as never })
    expect(await listarDiagnosticos(cliente)).toEqual(recibidos)
    expect(espias.select).toHaveBeenCalledWith('id, creado_en, empresa, correo, acepta_contacto, media, nivel')
  })

  test('comprueba si el usuario es del equipo', async () => {
    const sesion = { user: { id: 'u1', email: 'equipo@example.com' } }
    expect(await esDelEquipo(clienteFalso({ sesion, esMiembro: true }).cliente, 'u1')).toBe(true)
    expect(await esDelEquipo(clienteFalso({ sesion, esMiembro: false }).cliente, 'u1')).toBe(false)
  })

  test('resume total, media, contactos y niveles', () => {
    const r = resumir(recibidos)
    expect([r.total, r.conCorreo, r.porNivel]).toEqual([3, 1, { Transformando: 1, Probando: 2 }])
    expect(r.media).toBeCloseTo(2.5)
    expect(resumir([])).toEqual({ total: 0, media: 0, conCorreo: 0, porNivel: {} })
  })
})
