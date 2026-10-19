import { Fragment } from 'react'
import { diagnostico } from '../contenido'
import type { Respuestas } from '../logica/puntuacion'

interface Props {
  respuestas: Respuestas
  alContestar: (preguntaId: string, valor: number) => void
}

export function Cuestionario({ respuestas, alContestar }: Props) {
  return (
    <form id="cuestionario" noValidate onSubmit={(e) => e.preventDefault()}>
      {diagnostico.preguntas.map((p, i) => {
        const empiezaArea = i === 0 || diagnostico.preguntas[i - 1].area !== p.area
        const area = diagnostico.areas.find((a) => a.id === p.area)
        return (
          <Fragment key={p.id}>
            {empiezaArea && <div className="dimension">{area?.nombre}</div>}
            <fieldset>
              <legend>{p.texto}</legend>
              <div className="opciones">
                {p.opciones.map((opcion, j) => (
                  <label className="opcion" key={opcion}>
                    <input
                      type="radio"
                      name={p.id}
                      id={`${p.id}-${j + 1}`}
                      value={j + 1}
                      checked={respuestas[p.id] === j + 1}
                      onChange={() => alContestar(p.id, j + 1)}
                    />
                    <span className="punto" aria-hidden="true">{j + 1}</span>
                    <span>{opcion}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </Fragment>
        )
      })}
    </form>
  )
}
