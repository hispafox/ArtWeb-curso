// Revisa las migraciones de supabase/migrations: las reglas mínimas que no pueden faltar.
import { describe, expect, test } from 'vitest'

const ficheros = import.meta.glob('../../supabase/migrations/*.sql', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const sql = Object.values(ficheros).join('\n').replace(/--.*$/gm, '').toLowerCase()

const tablas = [...sql.matchAll(/create table (?:if not exists )?(public\.\w+)/g)].map((m) => m[1])
const politicas = [...sql.matchAll(/create policy "[^"]+"\s+on (public\.\w+)\s+for (\w+)\s+to ([\w, ]+?)\s+(using|with check)\s*\(([\s\S]*?)\);/g)]
  .map((m) => ({ tabla: m[1], operacion: m[2], roles: m[3].split(',').map((r) => r.trim()), condicion: m[5].replace(/\s+/g, ' ').trim() }))

describe('las migraciones', () => {
  test('hay migraciones y crean tablas', () => {
    expect(Object.keys(ficheros).length).toBeGreaterThan(0)
    expect(tablas).toEqual(['public.diagnosticos', 'public.miembros_equipo'])
  })

  test('los nombres siguen el formato de Supabase: fecha y hora, y una descripción', () => {
    for (const nombre of Object.keys(ficheros)) expect(nombre).toMatch(/\/\d{14}_[a-z0-9_]+\.sql$/)
  })

  test('todas las tablas tienen activadas las reglas de acceso (RLS)', () => {
    for (const tabla of tablas) expect(sql, tabla).toContain(`alter table ${tabla} enable row level security`)
  })

  test('todas las tablas tienen al menos una regla', () => {
    for (const tabla of tablas) expect(politicas.some((p) => p.tabla === tabla), tabla).toBe(true)
  })

  test('nadie sin sesión puede leer, cambiar ni borrar', () => {
    const peligrosas = politicas.filter((p) => p.roles.includes('anon') && p.operacion !== 'insert')
    expect(peligrosas).toEqual([])
    expect(sql).not.toMatch(/grant (all|select|update|delete)[^;]* to [^;]*\banon\b/)
  })

  test('leer los diagnósticos exige ser del equipo, no basta con tener usuario', () => {
    const lectura = politicas.find((p) => p.tabla === 'public.diagnosticos' && p.operacion === 'select')
    expect(lectura?.roles).toEqual(['authenticated'])
    expect(lectura?.condicion).toContain('public.miembros_equipo')
    expect(lectura?.condicion).toContain('auth.uid()')
  })

  test('ninguna regla deja hacer cualquier cosa con un «true» a secas', () => {
    for (const p of politicas) expect(p.condicion, `${p.tabla} ${p.operacion}`).not.toBe('true')
  })

  test('no hay reglas para cambiar ni borrar diagnósticos', () => {
    expect(politicas.filter((p) => p.tabla === 'public.diagnosticos' && ['update', 'delete', 'all'].includes(p.operacion))).toEqual([])
  })
})
