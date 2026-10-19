import { textos } from '../contenido'

export function Cabecera({ alLimpiar }: { alLimpiar: () => void }) {
  const t = textos.cabecera
  return (
    <header>
      <span className="marca">{t.marca}</span>
      <h1>{t.tituloAntes} <i>{t.tituloDestacado}</i>{t.tituloDespues}</h1>
      <p className="entradilla">{t.entradilla}</p>
      <p className="aviso">
        {t.avisoAntes} <button type="button" onClick={alLimpiar}>{t.avisoBoton}</button>{t.avisoDespues}
      </p>
    </header>
  )
}
