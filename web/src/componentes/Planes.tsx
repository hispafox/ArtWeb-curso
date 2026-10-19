import { propuesta, textos } from '../contenido'
import { euros, rellenar } from '../logica/formato'

interface Props {
  elegido: string
  alElegir: (planId: string) => void
}

export function Planes({ elegido, alElegir }: Props) {
  const t = textos.planes
  return (
    <section aria-labelledby="t-plan">
      <div><span className="paso">{t.paso}</span><h2 id="t-plan">{t.titulo}</h2></div>
      <div className="planes" role="radiogroup" aria-labelledby="t-plan">
        {propuesta.planes.map((p) => (
          <label className="plan" key={p.id}>
            <input
              type="radio"
              name="plan"
              id={`plan-${p.id}`}
              value={p.id}
              checked={p.id === elegido}
              onChange={() => alElegir(p.id)}
            />
            <span className="marca">{t.elegido}</span>
            <span className="nombre">{p.nombre}</span>
            <span className="lema">{p.lema}</span>
            <span className="cifras">
              <span>{rellenar(t.semanas, { semanas: p.semanasPorFase.reduce((a, b) => a + b, 0) })}</span>
              <span>{euros(p.precio)}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  )
}
