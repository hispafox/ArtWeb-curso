import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import App from './App'

const dato = (id: string) => document.getElementById(id)!
const sinEspacios = (texto: string | null) => (texto ?? '').replace(/\s/g, ' ')

describe('la propuesta', () => {
  test('arranca con el plan Implantación y su resumen', () => {
    render(<App />)
    expect(screen.getByRole('radio', { name: /Implantación/ })).toBeChecked()
    expect(dato('r-plan')).toHaveTextContent('Implantación')
    expect(dato('r-semanas')).toHaveTextContent('10 semanas')
    expect(dato('r-inicio')).toHaveTextContent('2 de noviembre de 2026')
    expect(dato('r-fin')).toHaveTextContent('8 de enero de 2027')
    expect(sinEspacios(dato('r-precio').textContent)).toBe('24.500 €')
    expect(screen.getByText('Válida hasta el 18 de noviembre de 2026')).toBeInTheDocument()
  })

  test('al elegir otro plan cambian lo que incluye, el calendario y el precio', async () => {
    const usuario = userEvent.setup()
    const { container } = render(<App />)
    await usuario.click(screen.getByRole('radio', { name: /Piloto/ }))
    expect(dato('r-plan')).toHaveTextContent('Piloto')
    expect(dato('r-semanas')).toHaveTextContent('6 semanas')
    expect(sinEspacios(dato('r-precio').textContent)).toBe('9800 €')
    expect(container.querySelectorAll('.incluye li[data-incluido="true"]')).toHaveLength(3)
    expect(container.querySelectorAll('.gantt .barra')).toHaveLength(5)
    expect(screen.getByText('El proyecto dura 6 semanas, de un lunes a un viernes.')).toBeInTheDocument()
  })

  test('los extras suman precio y semanas', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('checkbox', { name: /inglés/ }))
    expect(sinEspacios(dato('r-precio').textContent)).toBe('27.700 €')
    expect(dato('r-semanas')).toHaveTextContent('12 semanas')
    await usuario.click(screen.getByRole('checkbox', { name: /supervisores/ }))
    expect(dato('r-formacion')).toHaveTextContent('16 horas')
  })

  test('en Escala el soporte viene incluido: la casilla se bloquea y el calendario lo pinta al final', async () => {
    const usuario = userEvent.setup()
    const { container } = render(<App />)
    await usuario.click(screen.getByRole('radio', { name: /Escala/ }))
    const soporte = screen.getByRole('checkbox', { name: /Tres meses de soporte/ })
    expect(soporte).toBeDisabled()
    expect(soporte).toBeChecked()
    expect(container.querySelector('#fila-soporte .coste')).toHaveTextContent('Incluido')
    expect(container.querySelector('.gantt .barra.acomp')).not.toBeNull()
    expect(sinEspacios(dato('r-precio').textContent)).toBe('41.000 €')
  })

  test('cambiar la fecha de arranque mueve el calendario', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('¿Cuándo empezamos?'), { target: { value: '2026-11-09' } })
    expect(dato('r-inicio')).toHaveTextContent('9 de noviembre de 2026')
    expect(dato('r-fin')).toHaveTextContent('15 de enero de 2027')
  })

  test('aceptar el plan muestra el aviso, y cualquier cambio lo esconde', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('button', { name: 'Aceptar este plan' }))
    expect(screen.getByText(/Has elegido el plan Implantación, con arranque el 2 de noviembre de 2026/)).toBeInTheDocument()
    await usuario.click(screen.getByRole('radio', { name: /Piloto/ }))
    expect(screen.queryByText(/Has elegido el plan/)).not.toBeInTheDocument()
  })

  test('trae el pie del original', () => {
    render(<App />)
    expect(screen.getByText(/La empresa, los planes y las cifras son inventados/)).toBeInTheDocument()
  })
})
