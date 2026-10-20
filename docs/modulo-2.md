# Módulo 2 · Claude Code de escritorio sin programar

En este módulo le haces a Claude Code tu primer encargo sobre un artefacto y compruebas que lo ha hecho bien. El artefacto es la **calculadora de ahorro** (`artefactos/calculadora-ahorro.html`).

## Lo que hay en esta rama

Lo de la rama `modulo-1/el-camino` más este documento.

## Antes de empezar: lo que se instala una vez

El paso a paso, en Windows y en Mac, está en [`docs/instalacion.md`](instalacion.md), con Visual Studio Code como opción. Aquí va el resumen.

| Qué | Para qué | Cómo se comprueba |
|---|---|---|
| La aplicación de escritorio de Claude | Trae Claude Code en su pestaña **Code**. Necesita un plan Pro, Max, Team o Enterprise: el gratuito no incluye Claude Code | Abres la app y ves la pestaña Code |
| Git | Es lo que usa Claude para guardar versiones y subirlas a GitHub (módulo 3) | Se lo preguntas a Claude, como en el recuadro de abajo |
| Node.js | Lo necesita una web hecha con React para verla en tu equipo antes de publicarla (módulo 4), y también el hook que protege la rama principal (módulo 3). Instala la versión LTS más reciente, la 24 en octubre de 2026: las pruebas de las webs del curso piden como mínimo la 22.12 | Igual |
| La CLI de GitHub (`gh`) | Hace falta para que Claude abra pull requests desde la app (módulo 3). La app ofrece instalarla la primera vez que la necesita | Igual |
| Las cuentas conectadas | Los conectores de GitHub, Vercel y Supabase, para que Claude trabaje con ellos | En la pestaña Code, botón **+** › **Connectors**, o en Settings › Connectors |

Para comprobarlo todo de una vez:

> Comprueba si tengo instalados Git, Node.js y la CLI de GitHub, y dime qué versión tiene cada uno. No instales nada sin preguntarme.

A partir de aquí, ningún comando: todo se le pide a Claude hablando.

## La carpeta y la conversación

Cada sesión de Claude Code va unida a una carpeta, y esa carpeta decide con qué ficheros trabaja. Abre una sesión nueva con la carpeta `ArtWeb-curso` y pídele:

> Cámbiate a la rama `modulo-2/claude-code`.

## Cómo se pide

Se le habla como a una persona del equipo. Ayuda tener presentes cuatro cosas:

- **El objetivo:** qué quieres conseguir.
- **El contexto:** para quién es y por qué.
- **Las fuentes:** qué fichero, qué datos, qué ejemplo tiene que mirar.
- **Lo que esperas:** cómo sabrás que está bien.

Dictar en vez de escribir acelera mucho el trabajo, y Claude entiende igual una petición hablada que una escrita.

## Quién aprueba cada cambio

Claude Code trabaja en varios modos, y cada sesión muestra en cuál está:

| Modo | Qué hace |
|---|---|
| **Manual** | Pide permiso antes de cada cambio y de cada acción. Es el que se usa en el curso |
| **Accept edits** | Cambia ficheros sin preguntar, pero pide permiso para lo demás |
| **Plan** | Propone lo que va a hacer sin tocar nada |
| **Auto** | Las acciones no las revisa una persona, sino un clasificador automático |

Fija **Manual** a propósito al empezar, porque no sabes con qué modo arrancará la sesión: el modo se recuerda por carpeta, y el modo Plan solo dura la sesión. Cuando Claude te pida permiso, lee qué va a cambiar antes de aceptar. Por qué lo que publica, borra o toca datos se aprueba siempre lo verás en el módulo 7.

## Tu primer encargo

Con la carpeta abierta, en modo Manual:

> Objetivo: quiero que la calculadora de ahorro sirva para enseñársela a una gestoría.
> Contexto: el artefacto está en `artefactos/calculadora-ahorro.html`.
> Lo que quiero: cambia los tres ejemplos de «Empieza con un ejemplo» por tareas típicas de una gestoría, como conciliar los extractos del banco o preparar los modelos trimestrales, con cifras razonables. Debajo del título, añade la frase «Pensada para gestorías». No toques el diseño ni los cálculos.
> Cuando acabes, dime qué has cambiado y ábrela en el navegador de la app.

## Qué debe salir y cómo sabes que está bien

- [ ] Claude te ha pedido permiso antes de cambiar el fichero, y has visto qué iba a cambiar.
- [ ] La calculadora se abre en el navegador de la app con **tres ejemplos de gestoría** en los botones de «Empieza con un ejemplo».
- [ ] Al pulsar cada ejemplo, **los mandos se mueven** y el resultado cambia.
- [ ] La frase **«Pensada para gestorías»** está debajo del título.
- [ ] Los colores, las letras y la disposición **son los de antes**.

Si algo no está como lo pediste, no lo aceptes: dile qué falta y que lo rehaga.

> Falta la frase debajo del título, y el ejemplo de los modelos trimestrales tiene unas cifras que no cuadran: nadie los prepara 30 veces por semana. Corrígelo.

Y comprueba lo que da por hecho. A veces Claude asegura haber creado o cambiado un fichero que no está como dice:

> ¿Dónde has guardado el cambio? Enséñame las líneas que has tocado.

## Conversaciones cortas

Cuando una conversación se alarga mucho, Claude empieza a dar más vueltas para llegar al mismo sitio. El anillo que hay junto al selector de modelo dice cuánto se ha llenado. La salida es abrir otra conversación (**+ New session**, o Ctrl+N), y antes, para no perder el hilo:

> Deja escrito en `docs/notas-de-trabajo.md` lo que hemos hecho y lo que falta, para seguir en otra conversación.

La conversación nueva empieza así:

> Lee `docs/notas-de-trabajo.md` y sigue con lo que falta.

Si después de dos correcciones Claude sigue sin acertar, también conviene empezar de nuevo, con lo aprendido escrito en la petición.

## Tu práctica

La **calculadora de ahorro**, con el encargo de arriba o con uno tuyo: cámbiala para un tipo de cliente con el que trabaje tu equipo. No hace falta guardar el cambio todavía: guardar versiones es el módulo 3.
