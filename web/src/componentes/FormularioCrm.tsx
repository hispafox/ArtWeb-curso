import { textos } from '../contenido'

/*
 * ─────────────────────────────────────────────────────────────────────
 *  HUECO PARA EL FORMULARIO DEL CRM
 * ─────────────────────────────────────────────────────────────────────
 *  Aquí va el formulario de contacto que ya tiene la empresa en su CRM.
 *  Las respuestas llegan al CRM como hasta ahora: la web no guarda nada.
 *  Si las respuestas tuvieran que quedarse en la propia web, haría falta
 *  un backend (módulo 6), no este hueco.
 *
 *  Cómo se rellena: se copia el «código de inserción» (embed) del
 *  formulario en el CRM y se le pide a Claude:
 *    «Mete en el hueco del formulario del CRM este código de inserción: …»
 *
 *  Instrucciones para Claude:
 *  - Si el código es un <iframe>, ponlo dentro del div #formulario-crm
 *    como JSX (src, title, width="100%" y un alto fijo) y quita el
 *    párrafo provisional.
 *  - Si es un <script> que dibuja el formulario en un elemento, React no
 *    lo ejecuta si se pega tal cual: carga el script en index.html, o con
 *    un useEffect en este componente, y apúntalo al div #formulario-crm.
 *  - Los códigos de inserción de formularios son públicos y pueden ir en
 *    el repositorio. Una clave de la API del CRM no: si el código pide
 *    una, para y avisa.
 *  - Después, enseña la web en el navegador de la app y envía una
 *    respuesta de prueba con datos inventados.
 * ─────────────────────────────────────────────────────────────────────
 */
export function FormularioCrm() {
  const t = textos.contacto
  return (
    <section aria-labelledby="t-contacto" id="contacto">
      <div><span className="paso">{t.paso}</span><h2 id="t-contacto">{t.titulo}</h2></div>
      <div className="contacto">
        <p>{t.intro}</p>
        <div id="formulario-crm" className="formulario-crm">
          {/* ↓↓↓ Aquí va el formulario del CRM ↓↓↓ */}
          <p>{t.pendiente} <a href={`mailto:${t.correo}`}>{t.correo}</a></p>
          {/* ↑↑↑ Hasta aquí ↑↑↑ */}
        </div>
      </div>
    </section>
  )
}
