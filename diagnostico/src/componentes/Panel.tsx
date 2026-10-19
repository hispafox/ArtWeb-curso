import { useEffect, useState, type FormEvent } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { diagnostico, textos } from '../contenido'
import { fechaCorta, unDecimal } from '../logica/formato'
import { esDelEquipo, listarDiagnosticos, resumir, type DiagnosticoRecibido } from '../servicios/diagnosticos'

const t = textos.panel

export function Panel({ cliente }: { cliente: SupabaseClient | null }) {
  return (
    <section className="panel">
      <header className="panel-cabecera">
        <span className="marca">{textos.cabecera.marca}</span>
        <h1>{t.titulo}</h1>
        <a href="/" className="enlace">{t.volver}</a>
      </header>
      {cliente ? <PanelConectado cliente={cliente} /> : <p className="nota">{t.sinConfigurar}</p>}
    </section>
  )
}

function PanelConectado({ cliente }: { cliente: SupabaseClient }) {
  // undefined mientras se comprueba si ya hay sesión iniciada
  const [sesion, setSesion] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    let activo = true
    cliente.auth.getSession().then(({ data }) => { if (activo) setSesion(data.session) })
    const { data } = cliente.auth.onAuthStateChange((_evento, nueva) => setSesion(nueva))
    return () => {
      activo = false
      data.subscription.unsubscribe()
    }
  }, [cliente])

  if (sesion === undefined) return null
  if (!sesion) return <FormularioEntrada cliente={cliente} />
  return <Diagnosticos cliente={cliente} sesion={sesion} />
}

function FormularioEntrada({ cliente }: { cliente: SupabaseClient }) {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [entrando, setEntrando] = useState(false)
  const [error, setError] = useState('')

  async function entrar(evento: FormEvent) {
    evento.preventDefault()
    setEntrando(true)
    setError('')
    const { error: fallo } = await cliente.auth.signInWithPassword({ email: correo.trim(), password: contrasena })
    setEntrando(false)
    if (fallo) setError(t.errorEntrar)
  }

  return (
    <form className="entrada" onSubmit={entrar}>
      <p>{t.entrar}</p>
      <label>{t.correo}<input type="email" autoComplete="username" required value={correo} onChange={(e) => setCorreo(e.target.value)} /></label>
      <label>{t.contrasena}<input type="password" autoComplete="current-password" required value={contrasena} onChange={(e) => setContrasena(e.target.value)} /></label>
      <div className="aviso-error" aria-live="assertive">{error}</div>
      <button className="enviar" type="submit" disabled={entrando}>{entrando ? t.entrando : t.botonEntrar}</button>
    </form>
  )
}

type Carga =
  | { estado: 'cargando' }
  | { estado: 'sin-permiso' }
  | { estado: 'error' }
  | { estado: 'listo'; diagnosticos: DiagnosticoRecibido[] }

function Diagnosticos({ cliente, sesion }: { cliente: SupabaseClient; sesion: Session }) {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' })

  useEffect(() => {
    let activo = true
    ;(async () => {
      try {
        if (!(await esDelEquipo(cliente, sesion.user.id))) {
          if (activo) setCarga({ estado: 'sin-permiso' })
          return
        }
        const diagnosticos = await listarDiagnosticos(cliente)
        if (activo) setCarga({ estado: 'listo', diagnosticos })
      } catch {
        if (activo) setCarga({ estado: 'error' })
      }
    })()
    return () => { activo = false }
  }, [cliente, sesion.user.id])

  const salir = (
    <div className="sesion">
      <span>{sesion.user.email}</span>
      <button className="enviar claro" type="button" onClick={() => cliente.auth.signOut()}>{t.salir}</button>
    </div>
  )

  if (carga.estado === 'cargando') return salir
  if (carga.estado === 'sin-permiso') return <>{salir}<p className="nota">{t.sinPermiso}</p></>
  if (carga.estado === 'error') return <>{salir}<p className="aviso-error">{t.errorCargar}</p></>

  const resumen = resumir(carga.diagnosticos)
  return (
    <>
      {salir}
      <div className="cifras">
        <div className="cifra-panel"><strong>{resumen.total}</strong><span>{t.recibidos}</span></div>
        <div className="cifra-panel"><strong>{resumen.total ? unDecimal(resumen.media) : t.sinDato}</strong><span>{t.media}</span></div>
        <div className="cifra-panel"><strong>{resumen.conCorreo}</strong><span>{t.conCorreo}</span></div>
        {diagnostico.niveles.map((n) => (
          <div className="cifra-panel" key={n.nombre}>
            <strong>{resumen.porNivel[n.nombre] ?? 0}</strong><span>{n.nombre}</span>
          </div>
        ))}
      </div>
      {carga.diagnosticos.length === 0 ? (
        <p className="nota">{t.vacio}</p>
      ) : (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>{t.columnas.fecha}</th><th>{t.columnas.empresa}</th><th>{t.columnas.correo}</th>
                <th>{t.columnas.media}</th><th>{t.columnas.nivel}</th>
              </tr>
            </thead>
            <tbody>
              {carga.diagnosticos.map((d) => (
                <tr key={d.id}>
                  <td>{fechaCorta(d.creado_en)}</td>
                  <td>{d.empresa ?? t.sinDato}</td>
                  <td>{d.correo ? <a href={`mailto:${d.correo}`}>{d.correo}</a> : t.sinDato}</td>
                  <td>{unDecimal(d.media)}</td>
                  <td>{d.nivel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
