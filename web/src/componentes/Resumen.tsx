import { textos } from '../contenido'
import type { Resultado } from '../logica/calculo'
import { euros, fechaLarga, rellenar } from '../logica/formato'

interface Props {
  resultado: Resultado
  aceptado: boolean
  alAceptar: () => void
}

export function Resumen({ resultado: r, aceptado, alAceptar }: Props) {
  const t = textos.resumen
  return (
    <aside className="resumen" aria-live="polite">
      <h2>{t.titulo}</h2>
      <dl className="datos">
        <div><dt>{t.plan}</dt><dd id="r-plan">{r.plan.nombre}</dd></div>
        <div><dt>{t.duracion}</dt><dd id="r-semanas">{rellenar(t.semanas, { semanas: r.total })}</dd></div>
        <div><dt>{t.arranque}</dt><dd id="r-inicio">{fechaLarga(r.inicio)}</dd></div>
        <div><dt>{t.fin}</dt><dd id="r-fin">{fechaLarga(r.fin)}</dd></div>
        <div><dt>{t.formacion}</dt><dd id="r-formacion">{rellenar(t.horas, { horas: r.formacion })}</dd></div>
        <div><dt>{t.equipo}</dt><dd id="r-equipo">{rellenar(t.personas, { personas: r.plan.equipo })}</dd></div>
      </dl>
      <div className="inversion">
        <span className="paso" style={{ color: 'inherit', opacity: 0.75 }}>{t.inversion}</span>
        <span className="cifra" id="r-precio">{euros(r.precio)}</span>
        <small>{t.iva}</small>
      </div>
      <button className="aceptar" type="button" onClick={alAceptar}>{t.aceptar}</button>
      {aceptado && (
        <p className="aceptado">{rellenar(t.aceptado, { plan: r.plan.nombre, inicio: fechaLarga(r.inicio) })}</p>
      )}
    </aside>
  )
}
