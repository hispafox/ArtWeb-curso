import { textos } from '../contenido'
import { rellenar } from '../logica/formato'

export function Pie() {
  return (
    <footer>
      {textos.pie} <span className="version">{rellenar(textos.version, { version: __VERSION__ })}</span>
    </footer>
  )
}
