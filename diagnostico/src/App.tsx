import { useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { diagnostico, textos } from './contenido'
import { Cabecera } from './componentes/Cabecera'
import { Cuestionario } from './componentes/Cuestionario'
import { Informe } from './componentes/Informe'
import { Panel } from './componentes/Panel'
import { obtenerCliente } from './lib/supabase'
import { puntuar, type Respuestas } from './logica/puntuacion'

interface Props {
  /** En las pruebas se pasa un cliente falso; en la web, el de lib/supabase.ts */
  cliente?: SupabaseClient | null
  ruta?: string
}

export default function App({ cliente = obtenerCliente(), ruta = window.location.pathname }: Props) {
  // Como en el original: arranca con las respuestas de ejemplo marcadas
  const [respuestas, setRespuestas] = useState<Respuestas>({ ...diagnostico.ejemplo })
  // Cambia al empezar en blanco, para que el informe y su envío empiecen de cero
  const [vuelta, setVuelta] = useState(0)
  const puntuacion = puntuar(respuestas, diagnostico)

  if (ruta.replace(/\/+$/, '') === '/panel') {
    return (
      <div className="marco">
        <Panel cliente={cliente} />
        <footer>{textos.pie}</footer>
      </div>
    )
  }

  return (
    <div className="marco">
      <Cabecera alLimpiar={() => { setRespuestas({}); setVuelta((v) => v + 1) }} />
      <div className="cuerpo">
        <Cuestionario respuestas={respuestas} alContestar={(id, valor) => setRespuestas((r) => ({ ...r, [id]: valor }))} />
        <Informe key={vuelta} puntuacion={puntuacion} respuestas={respuestas} cliente={cliente} />
      </div>
      <footer>{textos.pie}</footer>
    </div>
  )
}
