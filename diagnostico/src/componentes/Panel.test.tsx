import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { clienteFalso } from '../pruebas/clienteFalso'
import { Panel } from './Panel'

const sesion = { user: { id: 'u1', email: 'equipo@example.com' } }
const diagnosticos = [
  { id: '1', creado_en: '2026-10-23T09:00:00Z', empresa: 'Talleres de ejemplo', correo: 'ana@example.com', acepta_contacto: true, media: 3.5, nivel: 'Transformando' },
  { id: '2', creado_en: '2026-10-23T08:00:00Z', empresa: null, correo: null, acepta_contacto: false, media: 1.88, nivel: 'Probando' },
]

describe('el panel del equipo', () => {
  test('sin Supabase configurado, lo explica', () => {
    render(<Panel cliente={null} />)
    expect(screen.getByText(/no está configurado/)).toBeInTheDocument()
  })

  test('sin sesión, pide entrar con correo y contraseña', async () => {
    const { cliente } = clienteFalso()
    render(<Panel cliente={cliente} />)
    expect(await screen.findByLabelText('Correo')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  test('entra con el correo y la contraseña, y avisa si no son buenos', async () => {
    const usuario = userEvent.setup()
    const { cliente, espias } = clienteFalso({ errorAlEntrar: 'Invalid login credentials' })
    render(<Panel cliente={cliente} />)
    await usuario.type(await screen.findByLabelText('Correo'), 'equipo@example.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'una-contraseña')
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(espias.signInWithPassword).toHaveBeenCalledWith({ email: 'equipo@example.com', password: 'una-contraseña' })
    expect(await screen.findByText(/No se ha podido entrar/)).toBeInTheDocument()
  })

  test('a quien es del equipo le enseña los diagnósticos y el resumen', async () => {
    const { cliente } = clienteFalso({ sesion, esMiembro: true, diagnosticos })
    render(<Panel cliente={cliente} />)
    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3) // cabecera y dos diagnósticos
    expect(screen.getByRole('link', { name: 'ana@example.com' })).toHaveAttribute('href', 'mailto:ana@example.com')
    expect(screen.getByText('diagnósticos recibidos').previousSibling).toHaveTextContent('2')
    expect(screen.getByText('media sobre 4').previousSibling).toHaveTextContent('2,7')
    expect(screen.getByRole('cell', { name: '3,5' })).toBeInTheDocument()
  })

  test('a quien tiene usuario pero no es del equipo no le enseña nada', async () => {
    const { cliente } = clienteFalso({ sesion, esMiembro: false, diagnosticos })
    render(<Panel cliente={cliente} />)
    expect(await screen.findByText(/no tiene acceso al panel/)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  test('se puede cerrar la sesión', async () => {
    const usuario = userEvent.setup()
    const { cliente, espias } = clienteFalso({ sesion, esMiembro: true, diagnosticos: [] })
    render(<Panel cliente={cliente} />)
    expect(await screen.findByText(/Todavía no ha llegado ningún diagnóstico/)).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(espias.signOut).toHaveBeenCalled()
  })
})
