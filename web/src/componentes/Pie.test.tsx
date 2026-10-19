import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import paquete from '../../package.json'
import { Pie } from './Pie'

describe('el pie', () => {
  test('muestra el número de versión del package.json', () => {
    render(<Pie />)
    expect(screen.getByText(`· Versión ${paquete.version}`)).toBeInTheDocument()
  })

  test('mantiene el aviso del original', () => {
    render(<Pie />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent(/La empresa, los planes y las cifras son inventados/)
  })
})
