# Contenido de la web

Aquí están todos los datos y los textos de la propuesta, aparte del diseño. Para cambiar lo que dice la web no hace falta tocar nada más.

| Fichero | Qué tiene |
|---|---|
| `propuesta.json` | Los datos: la fecha y la validez de la propuesta, la fecha de arranque que sale propuesta, el plan que sale elegido, las fases, lo que puede incluir, los tres planes (semanas de cada fase, precio, horas de formación, personas) y los extras. Es el objeto `PROPUESTA` del artefacto original, tal cual, más `planInicial` |
| `textos.json` | Los textos de la página: títulos, pasos, etiquetas del resumen, la sección de contacto y el pie |
| `tipos.ts` | La forma que tienen que tener los datos. No se toca para cambiar contenido |

Lo que va entre llaves, como `{semanas}` o `{fecha}`, lo rellena la web sola. Se puede mover de sitio dentro de la frase, pero no cambiar lo que hay dentro de las llaves.

En los extras, `semanas.fase` dice qué fase alargan, contando desde 0: 0 es «Descubrimiento» y 4, «Formación y arranque».

Para cambiarlo, se le pide a Claude, por ejemplo:

> Sube el plan Implantación a 26.000 € y añade al alcance «Conexión con la centralita».
