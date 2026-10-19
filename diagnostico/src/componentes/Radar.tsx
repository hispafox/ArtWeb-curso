import { textos } from '../contenido'
import { unDecimal } from '../logica/formato'
import type { ValorArea } from '../logica/puntuacion'
import { CX, CY, punto, puntos, visible } from '../logica/radar'

export function Radar({ areas }: { areas: ValorArea[] }) {
  const n = areas.length
  return (
    <svg className="radar" viewBox="0 0 360 330" role="img" aria-label={textos.informe.radar}>
      {[1, 2, 3, 4].map((anillo) => (
        <polygon key={anillo} points={puntos(Array(n).fill(anillo))} fill="none" stroke="var(--linea)" strokeWidth="1" />
      ))}
      {areas.map((a, i) => {
        const [x, y] = punto(i, n, 4)
        return <line key={a.id} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--linea)" />
      })}
      <polygon
        points={puntos(areas.map((a) => visible(a.valor)))}
        fill="var(--esmeralda)"
        fillOpacity=".22"
        stroke="var(--esmeralda)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {areas.map((a, i) => {
        const [x, y] = punto(i, n, visible(a.valor))
        const [lx, ly] = punto(i, n, 4.75)
        const ancla = Math.abs(lx - CX) < 4 ? 'middle' : lx > CX ? 'start' : 'end'
        return (
          <g key={a.id}>
            <circle cx={x} cy={y} r="4.5" fill="var(--esmeralda)" />
            <text x={lx} y={ly + 4} textAnchor={ancla}>{a.nombre}</text>
            <text className="numero" x={lx} y={ly + 18} textAnchor={ancla}>{a.valor ? unDecimal(a.valor) : '—'} / 4</text>
          </g>
        )
      })}
    </svg>
  )
}
