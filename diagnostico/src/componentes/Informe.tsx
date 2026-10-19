import { useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { diagnostico, textos } from '../contenido'
import { rellenar, unDecimal } from '../logica/formato'
import { enOrden, type Puntuacion, type Respuestas } from '../logica/puntuacion'
import { guardarDiagnostico, validar, type NuevoDiagnostico } from '../servicios/diagnosticos'
import { Radar } from './Radar'

interface Props {
  puntuacion: Puntuacion
  respuestas: Respuestas
  cliente: SupabaseClient | null
}

type Estado = 'editando' | 'enviando' | 'enviado'

export function Informe({ puntuacion: p, respuestas, cliente }: Props) {
  const t = textos.informe
  const e = textos.envio
  const total = diagnostico.preguntas.length
  const completo = p.contestadas === total
  const [empresa, setEmpresa] = useState('')
  const [correo, setCorreo] = useState('')
  const [aceptaContacto, setAceptaContacto] = useState(false)
  const [estado, setEstado] = useState<Estado>('editando')
  const [nota, setNota] = useState('')

  async function enviar() {
    if (!cliente) {
      setNota(e.sinConfigurar)
      return
    }
    const nuevo: NuevoDiagnostico = {
      empresa, correo, aceptaContacto,
      contestaciones: enOrden(respuestas, diagnostico),
      media: p.media,
      nivel: p.nivel!.nombre,
    }
    const error = validar(nuevo)
    if (error) {
      setNota(error === 'correo' ? e.errorCorreo : e.errorPermiso)
      return
    }
    setEstado('enviando')
    setNota('')
    try {
      await guardarDiagnostico(cliente, nuevo)
      setEstado('enviado')
      setNota(e.enviado)
    } catch {
      setEstado('editando')
      setNota(e.errorEnvio)
    }
  }

  return (
    <aside className="informe" aria-live="polite">
      <div className="progreso">
        <span>{rellenar(t.contestadas, { contestadas: p.contestadas, total })}</span><span>{t.informe}</span>
      </div>
      <div className="nivel">
        <span className="etiqueta">{t.tuNivel}</span>
        <span className="nombre">{p.nivel ? p.nivel.nombre : t.sinDatos}</span>
        <div className="escalera" aria-hidden="true">
          {diagnostico.niveles.map((n, i) => <span key={n.nombre} className={i <= p.indiceNivel ? 'si' : ''} />)}
        </div>
        <p>{p.nivel ? rellenar(t.media, { texto: p.nivel.texto, media: unDecimal(p.media) }) : t.sinDatosTexto}</p>
      </div>
      <Radar areas={p.porArea} />
      <div className="consejo">
        {p.floja ? (
          <><strong>{rellenar(t.empezar, { area: p.floja.nombre.toLowerCase() })}</strong><span>{p.floja.consejo}</span></>
        ) : (
          <><strong>{t.empezarSinDatos}</strong><span>{t.empezarSinDatosTexto}</span></>
        )}
      </div>

      {cliente && estado !== 'enviado' && (
        <div className="datos-envio">
          <label>{e.empresa}<input value={empresa} maxLength={120} onChange={(ev) => setEmpresa(ev.target.value)} /></label>
          <label>{e.correo}<input type="email" value={correo} maxLength={254} onChange={(ev) => setCorreo(ev.target.value)} /></label>
          <label className="casilla">
            <input type="checkbox" checked={aceptaContacto} onChange={(ev) => setAceptaContacto(ev.target.checked)} />
            {e.permiso}
          </label>
        </div>
      )}

      {estado !== 'enviado' && (
        <button type="button" className="enviar" disabled={!completo || estado === 'enviando'} onClick={enviar}>
          {!completo ? rellenar(t.faltan, { faltan: total - p.contestadas }) : estado === 'enviando' ? e.enviando : t.enviar}
        </button>
      )}
      {nota && <p className="nota" role={estado === 'enviado' ? 'status' : undefined}>{nota}</p>}
    </aside>
  )
}
