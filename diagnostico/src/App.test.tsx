import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import App from './App'
import { clienteFalso } from './pruebas/clienteFalso'

const informe = () => screen.getByRole('complementary')

function montar(cliente: SupabaseClient | null, ruta = '/') {
  return render(<App cliente={cliente} ruta={ruta} />)
}

describe('el diagnóstico', () => {
  test('arranca con las respuestas de ejemplo y su informe', () => {
    montar(null)
    expect(within(informe()).getByText('8 de 8 contestadas')).toBeInTheDocument()
    expect(within(informe()).getByText('Probando')).toBeInTheDocument()
    expect(within(informe()).getByText(/Media: 1,9 sobre 4/)).toBeInTheDocument()
    expect(within(informe()).getByText('Por dónde empezar: procesos')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Hay una persona de referencia/ })).not.toBeChecked()
    expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(8)
  })

  test('cambiar una respuesta cambia el informe al momento', async () => {
    const usuario = userEvent.setup()
    montar(null)
    for (const opcion of [/Ya hay tareas medidas/, /Se revisa y se aprende/, /Cuentas de empresa para todos/, /Hay normas, se conocen/]) {
      await usuario.click(screen.getByRole('radio', { name: opcion }))
    }
    expect(within(informe()).getByText('Integrando')).toBeInTheDocument()
    expect(within(informe()).getByText('Por dónde empezar: datos')).toBeInTheDocument()
  })

  test('empezar en blanco deja el informe sin datos y el envío bloqueado', async () => {
    const usuario = userEvent.setup()
    montar(null)
    await usuario.click(screen.getByRole('button', { name: 'empieza en blanco' }))
    expect(within(informe()).getByText('0 de 8 contestadas')).toBeInTheDocument()
    expect(within(informe()).getByText('Sin datos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Faltan 8 respuestas' })).toBeDisabled()
  })

  test('sin Supabase configurado, avisa de que no se guarda nada', async () => {
    const usuario = userEvent.setup()
    montar(null)
    expect(screen.queryByLabelText('Tu correo (opcional)')).not.toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Enviar mis respuestas' }))
    expect(screen.getByText(/el envío no está configurado/)).toBeInTheDocument()
  })

  test('envía las respuestas a Supabase, con el permiso si deja el correo', async () => {
    const usuario = userEvent.setup()
    const { cliente, espias } = clienteFalso()
    montar(cliente)
    await usuario.type(screen.getByLabelText('Nombre de tu empresa (opcional)'), 'Talleres de ejemplo')
    await usuario.type(screen.getByLabelText('Tu correo (opcional)'), 'ana@example.com')
    await usuario.click(screen.getByRole('button', { name: 'Enviar mis respuestas' }))
    expect(screen.getByText(/marca la casilla/)).toBeInTheDocument()
    expect(espias.insert).not.toHaveBeenCalled()

    await usuario.click(screen.getByRole('checkbox'))
    await usuario.click(screen.getByRole('button', { name: 'Enviar mis respuestas' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Recibido')
    expect(espias.insert).toHaveBeenCalledWith({
      empresa: 'Talleres de ejemplo', correo: 'ana@example.com', acepta_contacto: true,
      contestaciones: [2, 2, 3, 2, 1, 2, 2, 1], media: 1.88, nivel: 'Probando',
    })
    expect(screen.queryByRole('button', { name: 'Enviar mis respuestas' })).not.toBeInTheDocument()
  })

  test('si el envío falla, lo dice y deja reintentar', async () => {
    const usuario = userEvent.setup()
    const { cliente } = clienteFalso({ errorAlGuardar: 'sin conexión' })
    montar(cliente)
    await usuario.click(screen.getByRole('button', { name: 'Enviar mis respuestas' }))
    expect(await screen.findByText(/No se ha podido enviar/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar mis respuestas' })).toBeEnabled()
  })

  test('la dirección /panel abre el panel del equipo', () => {
    montar(null, '/panel')
    expect(screen.getByRole('heading', { name: 'Panel del equipo' })).toBeInTheDocument()
  })
})
