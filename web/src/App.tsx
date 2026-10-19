import { useState } from 'react'
import { propuesta, textos } from './contenido'
import { Ajustes } from './componentes/Ajustes'
import { Cabecera } from './componentes/Cabecera'
import { Calendario } from './componentes/Calendario'
import { FormularioCrm } from './componentes/FormularioCrm'
import { Incluye } from './componentes/Incluye'
import { Planes } from './componentes/Planes'
import { Resumen } from './componentes/Resumen'
import { calcular, type Eleccion } from './logica/calculo'

export default function App() {
  const [eleccion, setEleccion] = useState<Eleccion>({
    plan: propuesta.planInicial,
    extras: [],
    inicio: propuesta.inicioPorDefecto,
  })
  // Como en el original: cualquier cambio esconde el aviso de «aceptado»
  const [aceptado, setAceptado] = useState(false)
  const resultado = calcular(eleccion, propuesta)

  function cambiar(parte: Partial<Eleccion>) {
    setEleccion((actual) => ({ ...actual, ...parte }))
    setAceptado(false)
  }

  function cambiarExtra(id: string, marcado: boolean) {
    cambiar({ extras: marcado ? [...eleccion.extras, id] : eleccion.extras.filter((x) => x !== id) })
  }

  return (
    <div className="marco">
      <main className="documento">
        <Cabecera />
        <Planes elegido={eleccion.plan} alElegir={(plan) => cambiar({ plan })} />
        <Ajustes
          planId={eleccion.plan}
          extras={eleccion.extras}
          inicio={eleccion.inicio}
          alCambiarExtra={cambiarExtra}
          alCambiarInicio={(inicio) => cambiar({ inicio })}
        />
        <Incluye incluye={resultado.incluye} />
        <Calendario resultado={resultado} />
        <FormularioCrm />
      </main>

      <Resumen resultado={resultado} aceptado={aceptado} alAceptar={() => setAceptado(true)} />

      <footer>{textos.pie}</footer>
    </div>
  )
}
