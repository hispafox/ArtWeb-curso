import { propuesta, textos } from '../contenido'
import { aFecha, masDias } from '../logica/calculo'
import { fechaLarga, rellenar } from '../logica/formato'

export function Cabecera() {
  const t = textos.cabecera
  const fecha = aFecha(propuesta.fecha)
  return (
    <header className="cabecera">
      <div className="referencia">
        <span>{t.referencia}</span>
        <span>{fechaLarga(fecha)}</span>
        <span>{rellenar(t.validez, { fecha: fechaLarga(masDias(fecha, propuesta.diasValidez)) })}</span>
      </div>
      <h1>{t.tituloAntes} <em>{t.tituloDestacado}</em></h1>
      <p className="entradilla">{t.entradilla}</p>
    </header>
  )
}
