import { propuesta, textos } from '../contenido'

export function Incluye({ incluye }: { incluye: Set<string> }) {
  const t = textos.incluye
  return (
    <section aria-labelledby="t-incluye">
      <div><span className="paso">{t.paso}</span><h2 id="t-incluye">{t.titulo}</h2></div>
      <ul className="incluye">
        {propuesta.alcance.map((a) => {
          const si = incluye.has(a.id)
          return (
            <li className={si ? '' : 'no'} key={a.id} data-incluido={si}>
              <span className="icono" aria-hidden="true">{si ? '✓' : '–'}</span>
              <span>{a.texto}<span className="solo-lector"> {si ? t.si : t.no}</span></span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
