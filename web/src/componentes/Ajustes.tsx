import { propuesta, textos } from '../contenido'
import { aFecha, extraIncluido } from '../logica/calculo'
import { diaSemana, euros, rellenar } from '../logica/formato'

interface Props {
  planId: string
  extras: string[]
  inicio: string
  alCambiarExtra: (extraId: string, marcado: boolean) => void
  alCambiarInicio: (fecha: string) => void
}

export function Ajustes({ planId, extras, inicio, alCambiarExtra, alCambiarInicio }: Props) {
  const t = textos.ajustes
  return (
    <section aria-labelledby="t-ajustes">
      <div><span className="paso">{t.paso}</span><h2 id="t-ajustes">{t.titulo}</h2></div>
      <div className="ajustes">
        <div className="fila-fecha">
          <label htmlFor="inicio">{t.inicio}</label>
          <input
            type="date"
            id="inicio"
            value={inicio}
            min={propuesta.fecha}
            onChange={(e) => { if (e.target.value) alCambiarInicio(e.target.value) }}
          />
          <span className="paso">{diaSemana(aFecha(inicio))}</span>
        </div>
        <div>
          {propuesta.extras.map((x) => {
            const incluido = extraIncluido(propuesta, x.id, planId)
            return (
              <label className={'extra' + (incluido ? ' incluido' : '')} id={`fila-${x.id}`} key={x.id}>
                <input
                  type="checkbox"
                  id={`extra-${x.id}`}
                  value={x.id}
                  disabled={incluido}
                  checked={incluido || extras.includes(x.id)}
                  onChange={(e) => alCambiarExtra(x.id, e.target.checked)}
                />
                <span className="titulo-extra">{x.titulo}</span>
                <span className="coste">{incluido ? t.incluido : rellenar(t.masPrecio, { precio: euros(x.precio) })}</span>
                <span className="detalle">{x.detalle}</span>
              </label>
            )
          })}
        </div>
      </div>
    </section>
  )
}
