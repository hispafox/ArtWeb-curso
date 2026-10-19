import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { FormularioCrm } from './FormularioCrm'

describe('el hueco del formulario del CRM', () => {
  test('tiene el contenedor donde va el código de inserción', () => {
    const { container } = render(<FormularioCrm />)
    expect(container.querySelector('#formulario-crm')).not.toBeNull()
  })

  test('mientras está vacío, ofrece el correo de contacto', () => {
    render(<FormularioCrm />)
    expect(screen.getByRole('link', { name: 'propuestas@example.com' })).toHaveAttribute('href', 'mailto:propuestas@example.com')
  })

  test('tiene su título y se puede enlazar con #contacto', () => {
    const { container } = render(<FormularioCrm />)
    expect(screen.getByRole('heading', { name: 'Cuéntanos qué te parece' })).toBeInTheDocument()
    expect(container.querySelector('section#contacto')).not.toBeNull()
  })
})
