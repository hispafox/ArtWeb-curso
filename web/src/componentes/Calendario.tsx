import type { CSSProperties } from 'react'
import { propuesta, textos } from '../contenido'
import { barras, type Resultado } from '../logica/calculo'
import { rellenar } from '../logica/formato'

export function Calendario({ resultado }: { resultado: Resultado }) {
  const t = textos.calendario
  const { barras: lista, totalVista } = barras(resultado, propuesta.fases, t.soporte)
  const marcas = [0, Math.round(totalVista / 2), totalVista]
  return (
    <section aria-labelledby="t-calendario">
      <div><span className="paso">{t.paso}</span><h2 id="t-calendario">{t.titulo}</h2></div>
      <div className="calendario">
        <div className="gantt" style={{ '--semanas': totalVista } as CSSProperties}>
          {lista.map((b) => (
            <div className="fila" key={b.nombre}>
              <span className="fase">{b.nombre} <span className="paso">{rellenar(t.semanasCorto, { semanas: b.semanas })}</span></span>
              <div className="pista">
                <div className={'barra' + (b.soporte ? ' acomp' : '')} style={{ left: `${b.izquierda}%`, width: `${b.ancho}%` }} />
              </div>
            </div>
          ))}
          <div className="escala">
            <span />
            <div className="marcas">{marcas.map((s) => <span key={s}>{rellenar(t.marca, { semana: s })}</span>)}</div>
          </div>
        </div>
      </div>
      <p className="nota-cal">
        {rellenar(resultado.acompanamiento ? t.notaConSoporte : t.notaSinSoporte, { semanas: resultado.total })}
      </p>
    </section>
  )
}
